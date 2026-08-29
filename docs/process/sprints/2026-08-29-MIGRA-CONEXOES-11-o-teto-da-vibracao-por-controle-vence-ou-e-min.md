---
sprint: MIGRA-CONEXOES-11
onda: MIGRA-CONEXOES
posse:
  M11:
    - src/hefesto_dualsense4unix/core/rumble.py
    - src/hefesto_dualsense4unix/profiles/manager.py
cria:
  - tests/unit/test_migra_conexoes_o_teto_por_controle.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  # A tela deste campo é da 05 (o `<select>` "Teto da vibração" de cada linha);
  # esta sprint é o que acontece por baixo dele.
  - MIGRA-CONEXOES-05
  # SÉRIE por arquivo (R5): também possuem `core/rumble.py` / `profiles/manager.py`.
  - LEVA-3
  - LEVA-DE-BACKGROUND-01
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/rumble.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

# MIGRA CONEXÕES · 11 — o teto por controle vence, ou o produto aplica o `min`?

**O defeito é uma decisão dela contra um desenho do produto, e os dois estão
escritos.**

Decisão dela, 28/08: **"o global manda, o do controle sobrepõe"**. O mockup a
desenha: o P3 aparece com **30% da força** enquanto o global vale **Sem teto**.

O produto faz outra coisa, e a razão está no fonte —
`src/hefesto_dualsense4unix/core/rumble.py:86-102`:

```python
def _sob_o_teto(mult: float, teto: float | None) -> float:
    """``mult`` limitado por ``teto`` — ``min``, **nunca** produto. …"""
    return min(mult, teto)
```

E o docstring diz por que o `min` está lá, com dois argumentos independentes:

1. **teto que multiplica não é teto** — 0,3 sobre um `custom` já amplificado a
   2,0 entrega 0,6, *"o dobro do que o Economia prometeu, e mais forte que o
   próprio Balanceado"*;
2. **o `min` preserva o denominador de `_controllers_to_rumble_scales`**
   (`profiles/manager.py:1760`) — o valor que chega ao backend **já vem escalado
   pela política global**, então o fator por unidade é **relativo**. Um produto
   mexeria na base daquela conta sem ninguém saber.

**Sobrepor de verdade significa deixar um controle passar do global.** É a
palavra dela contra o `min` — e é decisão de código de daemon, não de tela.

## O que já existe, e por que isto é "quase pronto"

* **Grava, e nenhuma tela mostra:** `profiles/manager._controllers_to_rumble_scales`
  (POR-UNIDADE-01, 10/08) já guarda política de vibração **por controle**,
  relativa à global.
* **O degrau tem dono único:** `daemon/subsystems/rumble.RUMBLE_POLICY_MULT`, e
  `core/rumble._ORCAMENTO_COM_TETO = "economia"` é quem diz qual perfil tem teto.
  A vibração é **o único recurso com teto real hoje** — as outras quatro linhas
  daquela tabela diziam "ainda não tem por onde ser limitado" e saem da tela por
  contrato.
* **A tela do campo é da `MIGRA-CONEXOES-05`**, com três opções: *Segue o
  global* · *Sem teto* · *30% da força* — e o `30%` **derivado** de
  `RUMBLE_POLICY_MULT`, nunca escrito. Este número já esteve errado **pelo
  dobro** na dica do mockup (dizia 60%), e nenhuma régua o via.

## O que entrega

Duas formas, e **a escolha é dela** (veja o fim). A sprint entrega **uma**:

**Forma A — o `min` fica, e a tela para de prometer sobreposição.**
`Segue o global` e um teto **mais apertado** que o global continuam funcionando;
um teto **mais folgado** que o global passa a ser recusado **com motivo na
tela**, em vez de aceito e ignorado. Zero linha de daemon; a mudança é de texto e
de validação. É a forma honesta do comportamento de hoje.

**Forma B — o do controle sobrepõe de verdade.** O teto por unidade deixa de ser
**relativo** e passa a ser **absoluto**: `_controllers_to_rumble_scales` muda de
denominador, e `_sob_o_teto` ganha um caminho em que o valor por controle **não**
é limitado pelo global. **O preço está escrito no docstring que ela vai
contrariar**, e ele é real: um `custom` amplificado pode entregar mais força do
que qualquer perfil promete. Quem executar a Forma B tem de pôr um teto absoluto
no fim da conta, ou o "teto" vira ganho.

Nas duas formas:

3. **O `?` do campo diz qual dos dois está valendo e de onde ele veio** — é a
   frase que substituiu a coluna "Vale Sem teto, do global" que ela mandou tirar
   (`D-O-SEM-TETO-SAI-DOS-DOIS-LUGARES`).
4. **O teto do controle sobrevive à troca de perfil, ou a tela diz que não.**
   Ausência de notícia lida como sucesso é o padrão que a queixa do Sackboy
   revelou, e ele cabe inteiro aqui.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_o_teto_por_controle.py` — sem daemon vivo, sem
`uinput` (a suíte já cria nós de verdade demais: 1289 num dia derrubaram a sessão
gráfica dela):

* **a regra escolhida é a que roda.** Tabela de casos: global `Sem teto` ×
  controle `30%`; global `30%` × controle `Sem teto`; os dois iguais; nenhum
  declarado. O resultado de cada um é o número que a regra **escolhida** manda.
  **Mordida:** troque `min` por produto e veja o caso 2 entregar 0,6 — o número
  que o docstring nomeia como o defeito.
* **o 30% é derivado, nunca digitado.** O teste lê
  `RUMBLE_POLICY_MULT["economia"]` e compara com o que a tela mostra.
  **Mordida:** escreva `0.3` no teste e ele deixa de morder — por isso a régua
  **lê**. Foi assim que o `60%` do mockup sobreviveu a uma leva inteira.
* **na Forma A, o teto folgado é RECUSADO COM MOTIVO.** Nunca aceito em silêncio.
  **Mordida:** aceite-o e o teste reprova: aceitar e ignorar é o defeito
  `LIGHTBAR-BT-RESET-01` com outra roupa — 330 mil escritas ignoradas e a janela
  dizendo que sim.
* **na Forma B, existe um teto absoluto no fim da conta.** **Mordida:** tire-o e
  veja um `custom` a 2,0 passar de qualquer perfil.
* **o valor por controle chega ao backend.** Dublê que captura a escala aplicada
  por `uniq`. **Mordida:** arranque a passagem e veja os quatro controles
  receberem o mesmo número — que é o estado de hoje, com a tela oferecendo quatro
  campos.

## O que é dela decidir

* **FORMA A OU FORMA B.** *"O teto por controle vence sempre, ou o produto aplica
  o `min` como faz hoje?"* O `min` é o que impede um "teto" de **aumentar** a
  força, e o produto o escolheu por escrito. A sua decisão de 28/08 aponta para a
  B. **A resposta muda o código do daemon, não a tela** — e por isso ela vem
  antes da execução, não depois.
* **A vibração é o único recurso com teto real.** Se a Forma B valer, vale só
  para ela; as outras quatro linhas continuam sem por onde ser limitadas, e
  saíram da tabela por isso.
