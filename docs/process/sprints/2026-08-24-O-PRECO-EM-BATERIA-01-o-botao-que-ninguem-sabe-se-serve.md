# O PREÇO EM BATERIA-01 — o botão que ninguém sabe se serve

**24/08/2026. GRAU: MEDIDO** onde a linha traz âncora; **NÃO MEDIDO** é o que
esta sprint existe para medir.

**Quando:** depois que a trilha de Bluetooth (`SPRINT_ORDER.md` §0.7) fechar as
sete perguntas dela. Pedido dela, literal: *"mapeia isso pra quando terminarmos
de medir tudo no bt"*. Não bloqueia nada antes disso.

---

## 1. O defeito, em uma frase

**O produto oferece desligar gatilho, vibração e barra de luz para poupar
bateria, e ninguém nesta casa sabe se isso poupa alguma coisa** — nenhum dos
178 ensaios do `docs/data/ensaios.csv` cronometrou consumo por feature.

---

## 2. O que está medido, e o que não está

### 2.1 Estas features não custam RÁDIO — isto está medido

Gatilho adaptativo, vibração, barra de luz, giroscópio e touchpad andam no mesmo
canal HID. O relatório de entrada sai na mesma taxa com eles ligados ou
desligados; os de saída andam no keepalive de 2 Hz
(`core/backend_pydualsense.py:253`, `OUT_REPORT_KEEPALIVE_SEC = 0.5`), que é
constante. **Só o microfone muda a conta**, e o preço dele está medido
(`daemon/subsystems/bt_mic.py`, A/B de 25/07/2026): 260,4 Hz sem, 276,7 Hz com.

### 2.2 O custo em BATERIA é NÃO MEDIDO, e a ausência é total

```
$ grep -ic 'bateria' docs/data/ensaios.csv     # 178 ensaios
0
```

Não há um ensaio. A afirmação *"a barra de luz gasta bateria"* é senso comum,
não medição desta casa — e foi com base nela que se decidiu manter um botão.

### 2.3 O INSTRUMENTO ÓBVIO NÃO SERVE, e é bom saber antes

A tentação é: carregar a 100%, jogar 30 min com tudo ligado, anotar; repetir com
a barra apagada. **Não funciona**, e o motivo está no próprio mapa de canais:

> `energia.bateria.degraus`: *"NÃO SÃO CINCO DEGRAUS. O código diz, com todas as
> letras, que são **ONZE níveis** (5, 15, …, 95, 100) num nibble"*

Resolução de ~10 pontos. Numa sessão de 30 minutos a leitura tem chance grande
de **não descer um degrau**, e as duas medições sairiam iguais. O resultado
seria *"não há diferença"* por cegueira do instrumento — o padrão
`o-instrumento-mente-mais-que-o-produto`, que já custou três alarmes falsos num
dia só nesta casa.

---

## 3. A inversão que faz a medição existir

**Não medir carga em tempo fixo. Medir tempo até uma queda fixa.**

O tempo é contínuo; o degrau é o que é grosso. Invertendo os eixos, a resolução
deixa de ser o gargalo.

E o instrumento **já existe e já está ligado**: `daemon/battery_journal.py` sonda
a cada 30 s (`:38`) com **duas réguas declaradas na mesma linha** — `pct_kernel`
(o `capacity` do `hid-playstation`) e `pct_handle`. Ele já carimba a hora de cada
queda de degrau.

**Logo a medição é PASSIVA.** Ela não precisa de procedimento, cronômetro nem
sessão dedicada: basta jogar com um perfil por vez e depois ler o diário.

---

## 4. As tarefas

### BAT-1 — o extrator, que lê o que o diário já gravou

`scripts/ensaios/preco_da_bateria.py` (novo). <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho --> Lê o journal do daemon, acha as
transições de degrau por controle, e devolve **minutos por degrau** em cada
janela, com o perfil que estava valendo.

**A mordida.** `tests/unit/test_preco_da_bateria.py::test_degrau_sem_transicao_nao_vira_taxa` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— alimenta um diário de 40 min em que a carga não muda de degrau e afirma que a
saída é `NÃO MEDIDO`, **não** `0 %/h`. Arrancada a cura, o extrator divide por
uma janela sem queda e publica um número inventado — que é exatamente o defeito
que a §2.3 nomeia. Segundo caso
`::test_duas_reguas_que_discordam_nao_viram_media`: com `pct_kernel` e
`pct_handle` em degraus diferentes, a saída declara as duas, e nunca a média.

**Prova de tela:** cosmética pré-aprovada (é script, não tela).

### BAT-2 — o perfil vale como rótulo do ensaio

O diário passa a carimbar, em cada amostra, qual perfil de desempenho estava
valendo. Sem isso as janelas não são comparáveis e o extrator da BAT-1 mede
ruído.

**A mordida.** `::test_amostra_sem_perfil_nao_entra_na_conta` — amostra sem
rótulo de perfil é descartada com motivo, não classificada como "tudo ligado"
por omissão. Arrancada a cura, uma sessão antiga entra na conta de um perfil que
ela nunca usou.

**Prova de tela:** cosmética pré-aprovada.

### BAT-3 — DELA, e é a única que não é de agente

Jogar **três sessões, uma por perfil**, cada uma até a carga cair **pelo menos
três degraus** (~30 pontos). Não há cronômetro nem anotação: o diário grava.

| perfil | o que fica ligado |
|---|---|
| Tudo ligado | gatilho, vibração sem teto, barra de luz |
| Bateria longa | gatilho, vibração com teto de 30 %, barra de luz apagada |
| Só o essencial | gatilho `Off`, vibração `Off`, barra apagada |

**Custo dela: NÃO VERIFICADO em horas.** Depende do consumo real, que é
justamente o que se quer medir. Ordem de grandeza pela capacidade do DualSense
(1560 mAh) e por autonomia relatada de 6 a 8 h: **~2 h por perfil**, e são horas
de jogo, não de bancada — ela joga, o diário mede.

**Nada de agente na mesa durante isto** (R3): o daemon é o instrumento.

### BAT-4 — a decisão que o número destrava

Com os três números na mão, a `D-INTERRUPTOR-DE-FEATURE` (em
`docs/data/decisoes-dela.csv`) fecha:

- **diferença pequena** → o interruptor de gatilho/vibração/barra **sai**, e três
  telas ficam mais limpas;
- **diferença grande** → ele **fica**, e passa a dizer **quanto custa**, com o
  número na tela e o selo `medido`.

A sprint não escolhe: ela produz o número que faz a escolha ser barata.

---

## 5. O que esta sprint NÃO faz

- Não mede o microfone: o preço dele em **rádio** já está medido, e ele fica
  fora do perfil por **privacidade** (ver `D-PERFIL-DE-DESEMPENHO`).
- Não mexe na tela. A redação do que a tela dirá depende do número.
- Não mede consumo do **adaptador** nem do PC — é a bateria do controle.

## 6. Qual pergunta de Bluetooth trava esta sprint

**Nenhuma.** Ela mede o controle, não o enlace. Mas ela **espera** a trilha de BT
por decisão dela, para não disputar a bancada — e porque as três sessões da
BAT-3 são horas de jogo que rendem mais depois que o rádio parar de mentir.

## 7. Posse

```
posse:      scripts/ensaios/preco_da_bateria.py (novo)
            tests/unit/test_preco_da_bateria.py (novo)
            src/hefesto_dualsense4unix/daemon/battery_journal.py (só o carimbo do perfil)
cria:       docs/data/ensaios.csv (três linhas, uma por perfil)
nao_toca:   app/, o mapa de canais, qualquer aba
depois_de:  a trilha de BT do SPRINT_ORDER.md §0.7
bancada:    DELA, três sessões de jogo — nenhum agente na mesa
```

## 8. O que sobrou para o próximo

- **A bateria dos EXTERNOS** (Pro Controller, 8BitDo) fica de fora pela
  `D-MVP-SO-DUALSENSE`: eles voltam na 1.0.
- **O consumo com quatro controles ao mesmo tempo** pode não ser a soma de
  quatro medições de um — o adaptador compartilhado muda o regime de rádio, e
  isso é outro ensaio.
