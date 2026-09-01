---
# onda: GATILHOS
sprint: ONDA-GATILHOS-03
posse:
  G3:
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
cria:
  - tests/unit/test_gatilhos_o_recibo_diz_os_dois_lados.py
bancada: false
depois_de:
  - ONDA-GATILHOS-02
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-GATILHOS-01
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/textos_de_aplicacao.py
  - src/hefesto_dualsense4unix/daemon/
---

# ONDA GATILHOS · 03 — o recibo dos dois lados

**O defeito em uma frase:** o recibo do L2 e o do R2 disputam **a mesma linha**
da barra de estado da janela, e o último apaga o outro — quem mexeu nos dois
gatilhos só consegue ler o desfecho de um.

## A medição

`triggers_actions.py:700-770` (`_toast_trigger`) escreve em
`bar.push(ctx_id, msg)` com `ctx_id = bar.get_context_id("trigger")` — **um
contexto só para os dois lados**. Um `push` do R2 cobre o do L2, e nada na tela
diz que o L2 chegou a existir. A barra é, além disso, a barra da **janela
inteira**: qualquer aba que fale depois apaga o gatilho.

O mockup põe o recibo **dentro do quadro**, com os dois lados de uma vez:

```
L2: Metralhadora — escrito no controle · R2: Arco de flecha — escrito no controle
```
— `layout/_ferramentas/aba03.py:100-103`

E o contrato manda manter o que a linha já sabe dizer:

> *"Recibo do desfecho no rodapé, com o erro traduzido — **fica**."*
> — `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:290`

## O que entrega

O `trigger_recibo` que a 02 criou passa a mostrar **o último desfecho de cada
lado**, lado a lado, separados por `·`. Cada metade guarda o que já se sabe
dizer hoje, sem vocabulário novo:

- **desfecho bom** — a frase que `frase_do_desfecho` devolve
  (`app/textos_de_aplicacao.py:316`), que é a **dona única** desse vocabulário:
  ela distingue *aplicado* de *guardado* de *nada aconteceu* pelo CORPO do
  daemon, e as três razões da janela entram como porquê. Nada disso se
  reimplementa aqui;
- **recusa por parâmetro** — `humanizar_erro_gatilho` (`:52`), que já traduz
  *"end (3) deve ser > start (5)"* para *"Fim (3) precisa ser maior que Início
  (5)"*;
- **daemon mudo** — a frase de hoje, que manda para o lugar certo (*"o Hefesto
  pode estar desligado (ligue na aba Sistema)"*).

A barra de estado da janela **continua recebendo** o mesmo texto: quem está com
o olho no rodapé não perde nada, e as outras abas não mudam de comportamento. O
que muda é que o quadro passa a ter memória dos dois lados.

**O que a tela NÃO passa a dizer:** *"confirmado no aparelho"*. Não existe canal
de leitura de gatilho no protocolo — `gatilho.leitura` é *não/não* nos dois
transportes em `docs/data/mapa-controles.csv`. O verbo é **escrito**, e o "?" do
quadro (sprint 02) carrega a ressalva.

## Os arquivos que toca

- `src/hefesto_dualsense4unix/app/actions/triggers_actions.py` — `_toast_trigger`
  ganha um dicionário por lado e escreve nas duas superfícies.

## Como se prova (o teste que morde)

`tests/unit/test_gatilhos_o_recibo_diz_os_dois_lados.py`:

1. **aplicar L2 e depois R2 deixa OS DOIS na linha.** Arranque a cura (volte ao
   `push` único) e o teste reprova mostrando só o R2. Esta é a mordida;
2. **o segundo desfecho do MESMO lado substitui o primeiro daquele lado** e não
   toca no outro — a linha não vira histórico;
3. **a recusa por parâmetro aparece traduzida** naquela metade, com a outra
   metade intacta: o dublê de IPC devolve `"end (3) deve ser > start (5)"` no
   R2 e sucesso no L2, e a linha traz *"Fim (3) precisa ser maior que Início
   (5)"* ao lado do L2 aplicado;
4. **o dublê sabe RECUSAR** — daemon mudo (`corpo=None`, `ok=False`,
   `motivo=None`) produz a frase que manda para a aba Sistema, e não um verde;
5. **a barra da janela continua recebendo o texto** — a regressão silenciosa
   seria mover o recibo e deixar o rodapé cego.

## O que é dela decidir

**A linha guarda o desfecho entre trocas de aba?** Hoje a barra é volátil por
natureza (a próxima aba a apaga). Com o recibo dentro do quadro ele passa a
sobreviver enquanto a janela viver. Esta sprint escreve o provisório *"sobrevive
na sessão, some ao trocar de perfil"* e o marca como
*PROVISÓRIO — decisão dela*.
