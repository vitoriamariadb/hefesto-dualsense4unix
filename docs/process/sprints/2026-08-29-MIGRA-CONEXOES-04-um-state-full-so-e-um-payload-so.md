---
sprint: MIGRA-CONEXOES-04
estado: absorvida
onda: MIGRA-CONEXOES
posse:
  M4:
    - src/hefesto_dualsense4unix/app/actions/config/pagina.py
cria:
  - tests/unit/test_migra_conexoes_um_state_full_so.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  # SÉRIE por arquivo: a 01 cria o `pagina.py` que esta sprint preenche.  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01, e a ausência é o assunto -->
  - MIGRA-CONEXOES-01
nao_toca:
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - scripts/telas/aba08.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA CONEXÕES · 04 — um `state_full` só, e um payload só

**O defeito:** abrir esta aba pede o **mesmo** estado ao daemon **três vezes**.

| onde | linha |
|---|---|
| `app/actions/config/secao_controles.py` | `:734` |
| `app/actions/config/secao_mesa.py` | `:975` |
| `app/actions/config/secao_orcamento.py` | `:671` |

A dívida está **declarada** no próprio produto — `secao_orcamento.py:612`: *"este
é o SEGUNDO `state_full` por entrada na aba"*. E a mesma aba mede a ocupação dos
1.600 turnos por **dois caminhos**, um logo abaixo do outro, que é o que a
`D-AS-ABAS-CONVERSAM` chamou de *"falha grotesca"* quando aconteceu entre duas
abas.

**E as três chamadas caem numa fila de um.** `app/ipc_bridge.py:52-60`:

```python
_EXECUTOR = concurrent.futures.ThreadPoolExecutor(max_workers=1, …)
```

Um worker. Três `call_async` simultâneos não são três leituras em paralelo — são
três leituras **em fila**, cada uma com `timeout_s` próprio, e a terceira seção
pinta com um estado até três timeouts mais velho que a primeira.

No motor novo isso deixa de ser uma dívida a pagar e vira **a forma da aba**: o
Python pinta **uma vez**, com **um** objeto.

## O que entrega

1. **`pagina.py` passa a ser o único que pede.** Um `daemon.state_full` por  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01, e a ausência é o assunto -->
   repintura, por `call_async` (a thread do GTK não bloqueia), com o **mesmo**
   `STATE_IPC_TIMEOUT_S` que o resto da casa usa.
2. **`dados(host, estado) -> dict` é o contrato de toda seção.** Nenhum
   `secao_*.py` volta a chamar `state_full`. Quem precisa do estado **recebe**.
   As sprints 05, 07, 09 e 10 escrevem os quatro `dados()` sobre este contrato.
3. **Um payload, uma pintura.** As quatro fatias entram num dicionário só e
   descem numa chamada de `run_javascript`. O custo está medido: a bomba de
   **130 valores a 2 Hz** custou **1,95 ms** — **0,4%** do orçamento. Pintar tudo
   junto é mais barato que pintar por pedaço, e some com a janela em que metade
   da tela é nova e metade é velha.
4. **Repintar é idempotente e coalescente.** Os dois refreshers que `app/app.py`
   pendura nesta aba (`_refresh_saude_da_mesa`, `_refresh_config_controles`,
   `app.py:1174-1175`) continuam existindo — e os **dois** passam a chamar
   `pagina.repintar()`. Uma repintura já em voo **não** enfileira outra: a
   segunda marca "refazer ao terminar" e volta. Assim o `app.py` **não é aberto**
   por esta onda, e o defeito de três leituras não pode voltar por um quarto
   chamador.
5. **A conta do rádio tem um dono só.** As duas contagens dos 1.600 turnos viram
   uma, dentro do payload — quem desenha a régua (`MIGRA-CONEXOES-10`) lê o mesmo
   número que quem escreve o exame.
6. **Falta de estado é estado.** Daemon parado, timeout ou resposta sem
   `controllers` não deixam a página com dado velho pintado: o payload traz o
   motivo e a página o mostra. **Ausência de notícia lida como sucesso** é o
   padrão que a queixa do Sackboy revelou, e ele nasce exatamente aqui.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_um_state_full_so.py`, com um `ipc_bridge`
dublê que **conta** chamadas (nunca um número escrito à mão):

* **uma leitura por entrada na aba.** Entrar na aba → o dublê registra
  **exatamente 1** `daemon.state_full`. **Mordida:** devolva a chamada de
  `secao_orcamento.py:671` e o teste reprova com 2.
* **portão de arquivo, e ele é o que impede a recaída.** `grep` em
  `src/hefesto_dualsense4unix/app/actions/config/` por `daemon.state_full`
  devolve ocorrência **só** em `pagina.py`. **Mordida:** ponha a string de volta  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01, e a ausência é o assunto -->
  em qualquer `secao_*.py` e o teste diz qual arquivo e qual linha.
* **coalescência.** Chamar os dois refreshers na mesma iteração → **1** leitura,
  e a segunda repintura acontece **depois** da primeira terminar, com dado novo.
  **Mordida:** arranque a guarda e veja duas leituras na fila de um worker.
* **a fila de um worker é respeitada.** O teste afirma
  `_get_executor()._max_workers == 1` — **lido**, não digitado. Se um dia alguém
  aumentar isso, quem executar esta aba tem de saber, e o teste conta.
* **daemon parado não pinta dado velho.** Payload com falha → a página mostra o
  motivo e **não** repete os valores da pintura anterior. **Mordida:** faça o
  `except` cair no `return` mudo e veja a tela afirmar o que não sabe.

## O que é dela decidir

Nada nesta sprint. Ela é fiação: junta três leituras numa e não muda uma palavra
da tela. Se a foto antes e depois não for idêntica, é defeito desta sprint.
