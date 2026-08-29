---
sprint: MIGRA-NAVEGACAO-09
onda: MIGRA-NAVEGACAO
posse:
  NAV6-RODA:
    - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
cria:
  - tests/unit/test_migra_navegacao_09_uma_escada_so.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-07  # a tela dos gestos é quem publica o degrau
  - ONDA-NAVEGACAO-02   # ela põe o KIND_DESKTOP na ESCADA — o quinto degrau
  - ONDA-NAVEGACAO-03   # ela é dona do mesmo arquivo (subsystems/hotkey.py)
  - ONDA-JOGAR-03
  - ONDA-JOGAR-05
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/integrations/ponte_escada.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - novo-layout/
---

# MIGRA NAVEGAÇÃO · 09 — A roda de pontes tem uma escada só, e a tela não vira a terceira verdade

## O defeito

**Há duas escadas vivas, com degraus diferentes, e a aba ia publicar uma
terceira.** Medido hoje:

| | quantos | quais |
|---|---|---|
| `CICLO_DE_PONTES` (`daemon/subsystems/hotkey.py:104`) | **3** | `dualsense` → `xbox` → `mouse_teclado` |
| `ESCADA` (`integrations/ponte_escada.py:294`) | **4** | DualSense → Xbox → **Nativo** → **DualSense + Steam Input** |
| o contrato promete na tela (§6) | **5** | DualSense → Xbox 360 → Nativa (Sony) → DualSense + Steam Input → **Teclado+Mouse** |

O ciclo tem o `mouse_teclado` e **não** tem Nativo nem Steam Input. A escada tem
Nativo e Steam Input e **não** tem o `KIND_DESKTOP` — que existe
(`ponte_escada.py:169`), é aceito pelas duas validações (`:375`, `:395`) e ficou
de fora da tupla.

`build_next_bridge_callback` (`hotkey.py:433`) escolhe entre as duas conforme
haja tentativa de escada em curso. E a própria docstring dele diz, textual, o
que o gesto **não** faz:

> `:485` — *"**NÃO liga o Steam Input.** Nenhuma linha deste repositório liga o
> Steam Input; o guard o DESLIGA e a allowlist só PRESERVA o que já estava
> ligado."*
> `:490` — *"**NÃO entra nem sai do MODO NATIVO.** (…) Entrar em Modo Nativo
> mataria o vpad SEM consultar o R-04 e, pior, mataria o próprio gesto."*

**Ou seja: dois dos cinco degraus que o contrato manda mostrar são degraus que o
gesto não alcança.** Duas verdades vivas é exatamente o defeito que a regra do
fato-errado existe para matar — e aqui a tela seria a terceira.

## O que entrega

1. **Uma escada só, e ela é a `ESCADA`.** `CICLO_DE_PONTES` deixa de ser uma
   lista paralela e passa a ser **derivado** dela: os degraus que o gesto
   alcança são os degraus da escada com `ao_vivo` verdadeiro (`Degrau.ao_vivo`
   já existe, `ponte_escada.py:288`: *"Este degrau alcança um jogo que já está
   aberto?"*). O `KIND_DESKTOP` entra na `ESCADA` pela `ONDA-NAVEGACAO-02`; esta
   sprint **consome** — não reescreve `ponte_escada.py` (está no `nao_toca`).
2. **A tela mostra os cinco e diz o que cada um custa.** Nem todo degrau é
   alcançável pelo gesto, e a diferença tem de estar na tela, não na docstring:
   os que exigem reabrir o jogo ou fechar a Steam aparecem com o preço ao lado.
   Os dois campos já existem no `Degrau` (`exige_reabrir_jogo`,
   `exige_fechar_steam`) e nunca chegaram a lugar nenhum.
3. **O `porque` de cada degrau vira a dica.** Cada `Degrau` já carrega a razão
   escrita da posição dele — a do primeiro é a mais cara e a mais fácil de
   perder: *"Dez linhas do mapa-controles.csv só chegam ao jogo por `uhid` (…)
   errar para Xbox custa as dez, e custa em silêncio."* É o item "o porquê de
   cada degrau da roda de pontes" que a §6 manda virar dica.
4. **A escolha do modo NÃO se repete aqui.** Ela mandou tirar em 27/08:
   *"aquela parte de roda dos pontos some também"*. Os cinco degraus do **Modo de
   conexão** se escolhem na aba **Jogar**; nesta aba fica **a linha do gesto**, e
   a dica do mockup já diz isso com todas as letras.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_09_uma_escada_so.py`:

1. **Não há duas listas.** `CICLO_DE_PONTES` é derivado da `ESCADA` — o teste
   acrescenta um degrau à `ESCADA` e exige que o ciclo mude junto. **Morde:**
   volte a tupla literal e reprova. Este teste é a régua que **não existia**: as
   duas listas divergiram por meses e nenhuma régua as comparava.
2. **A tela e o gesto dizem a mesma coisa.** Para cada degrau publicado: se o
   gesto não o alcança, a tela tem de dizer o preço. **Morde:** publique os cinco
   como se fossem todos ao vivo e reprova nomeando o Nativo e o Steam Input, e
   citando `hotkey.py:485` e `:490`.
3. **O Modo Nativo continua fora do ciclo do gesto.** Um `state` em modo nativo
   → `_ciclar_ponte` não faz nada e registra o motivo. **Morde:** tire a guarda
   (`hotkey.py`, o "cinto e suspensório") e reprova — sem porta de volta pelo
   controle, o beco é sem saída.
4. **A ordem não muda.** O primeiro degrau continua sendo a máscara DualSense.
   **Morde:** troque com o Xbox e reprova citando as dez linhas do mapa. É a
   única régua que protege a ordem, e errar o primeiro degrau custa dez recursos
   **em silêncio**.
5. **Nenhuma tela desta aba oferece a escolha do modo.** `grep` pela roda de
   escolha na página desta aba devolve zero. **Morde:** devolva-a e reprova
   citando a fala dela de 27/08.

## O que é dela decidir

- **Os degraus que o gesto não alcança aparecem na roda?** `PROVISÓRIO — decisão
  dela`. A proposta é **aparecerem com o preço**, e não sumirem: o contrato
  promete cinco, e esconder dois faria a tela contradizer o documento que ela
  aprovou. A alternativa honesta é o contrato passar a prometer três.
- **O `SUBIR_REABRINDO_O_JOGO` não tem executor** — está registrado no posto de
  comando de 29/08 como pendente. Enquanto não tiver, um degrau caro é uma
  promessa que ninguém cumpre, e a tela precisa dizer isso.
