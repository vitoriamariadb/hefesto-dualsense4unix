---
sprint: MIGRA-GATILHOS-07
onda: MIGRA-GATILHOS
posse:
  M7:
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
    - src/hefesto_dualsense4unix/app/app.py
cria:
  - tests/unit/test_migra_gatilhos_o_rascunho_e_a_escrita_por_coluna.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-04
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  # com as de baixo, e app.py com a ONDA-VIBRACAO-06.
  - MIGRA-GATILHOS-08
  - ONDA-VIBRACAO-06
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/app/app.py com estas.
  - IDENTIDADE-01  # fechou em 54b7ffd2; a série é nominal
  - ONDA-JOGAR-09
  - ONDA-NAVEGACAO-06
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-SISTEMA-02
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
  # AS OUTRAS ONDAS MIGRA, escritas no MESMO DIA e ainda em voo. A lista foi
  # medida em 29/08 com `check_colisao_de_sprints.py`; ela é um retrato, não
  # um contrato — quem coordena reconfere no despacho, porque as irmãs ainda
  # estavam sendo escritas quando esta linha foi tirada.
  - MIGRA-CONTROLES-01
  - MIGRA-JOGAR-01
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-07
  - MIGRA-VIBRACAO-01
  - MIGRA-NAVEGACAO-01
  - MIGRA-LANCADORES-10
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - novo-layout/
---

# MIGRA GATILHOS · 07 — o rascunho e a escrita, por coluna

**O defeito em uma frase:** a aba lê e escreve para **UM** alvo — o da fita —, e
o desenho aprovado tem **uma coluna por controle**, cada uma com o seu próprio
alvo. Sem esta sprint, as quatro colunas mostram o mesmo estado e escrevem no
mesmo controle.

## A boa notícia, medida: a ponte já está pronta dos dois lados

Isto **não é arquitetura nova, é um laço**:

| o quê | onde | já aceita por controle? |
|---|---|---|
| ler o rascunho | `draft.effective_triggers_for(uniq)` — `app/draft_config.py:1112` | **sim** |
| escrever o modo | `trigger_set_detalhado(side, mode, params, uniq=)` — `app/ipc_bridge.py:411` | **sim** |
| escrever pelo caminho nomeado | `_send_trigger_named(..., uniq=)` — `triggers_actions.py:604` | **sim** |
| soltar a trava | `trigger_reset_detalhado(side, uniq=)` — `ipc_bridge.py:474` | **sim** |
| o daemon do outro lado | `_handle_trigger_set` / `_handle_trigger_reset` — `daemon/ipc_handlers.py:1207`, `:1256` | **sim** |
| guardar o override por MAC | `draft.with_controller_triggers(uniq, …)` — `triggers_actions.py:391` | **sim** |

O que muda é **a origem do `uniq`**: hoje `alvo_de_edicao(self)`
(`triggers_actions.py:368`, `:603`, `:688`); amanhã, o `data-uniq` da coluna que
recebeu o gesto.

## O que entrega

1. **A pintura passa a ser um laço sobre as colunas.**
   `_refresh_triggers_from_draft` (`:169`) hoje chama
   `draft.effective_triggers_for(alvo_de_edicao(self).uniq)` **uma vez**
   (`:181`). Passa a chamar uma vez **por controle presente**, e pinta cada
   coluna nos endereços da sprint **02**: `select[data-papel=modo]`,
   `select[data-papel=pronto]`, e as barras.
2. **As barras viram controle de verdade.** Medido: o `.trilho` do mockup é um
   `<span>` com um `<span class=cheio>` de largura em % — **`<input>` no miolo:
   zero**. Quem for ligar a aba tem de **criar** o controle, não só fiá-lo.
   Junto com ele vem o que o produto já aprendeu: a porcentagem do trilho é
   **derivada** da faixa (`aba03.py:210`), a faixa vem de
   `TriggerParamSpec.min_value/max_value` (`trigger_specs.py`), e o valor vem de
   `draft_trigger.params[i]`.
3. **O gesto sabe de quem é.** Toda mensagem que chega do JavaScript carrega
   `(uniq, lado, papel[, param])`. O Python traduz `e`/`d` para `left`/`right`
   num lugar só — a língua da tela é dela, a do IPC é contrato.
4. **`_persist_params_to_draft` recebe o `uniq` do gesto** em vez de perguntar
   ao alvo global. **E o ramo "Todos" fica intocado**: ele é o fix HIGH do review
   de 16/07 (`:376-383`) — editar em "Todos" grava na seção global e **limpa o
   lado editado dos overrides de todo mundo**. Nenhuma coluna cai nesse ramo,
   porque coluna sempre tem `uniq`.
5. **A fita esmaece — e só agora.** `_ALVO_POR_ABA["tab_triggers_box"]`
   (`app.py:1227`) passa de `None` para `MOTIVO_ALVO_NAO_SE_APLICA`. A sprint
   **03** deixou esta linha de propósito: esmaecer antes de os gestos terem
   `uniq` deixa a aba **bonita e muda** — `alvo_de_edicao` cai em `DESCONHECIDO`
   e todo gesto recusa com toast (Z2-1/Z2-2). **As duas mudanças viajam juntas
   ou nenhuma viaja.**
6. **O "Aplicar" do rodapé não muda.** `footer_actions._apply_draft_agora:721`
   manda o rascunho inteiro por `profile.apply_draft` — as quatro colunas já
   estão dentro dele, porque cada uma gravou o seu override por MAC.

## O que a tela NÃO passa a dizer

**"O controle confirmou."** `gatilho.leitura` é `cabo_aciona=não` /
`radio_aciona=não` no `docs/data/mapa-controles.csv`, e a evidência é literal:
*"O offset exato do byte de status não está registrado no código deste projeto —
não localizado."* Não existe canal de leitura de estado de gatilho.

A dica da aba já diz isso com todas as letras (`aba03.py:339-340`):

> *"**O controle não responde de volta.** O protocolo não tem canal de leitura de
> gatilho: esta tela diz o que o Hefesto **escreveu**, nunca o que o aparelho
> confirmou."*

O verbo é **escrito**. Quem distingue *aplicado* de *guardado* de *nada
aconteceu* é `frase_do_desfecho` (`app/textos_de_aplicacao.py`), lendo o
`aplicado_em`/`guardado_em` do corpo do daemon — **dona única desse
vocabulário**, e nada disso se reimplementa na página. É o mesmo padrão de
`O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO`.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_o_rascunho_e_a_escrita_por_coluna.py`, com o
dublê de IPC de `tests/unit/test_triggers_actions.py`:

1. **Quatro colunas, quatro estados diferentes.** O rascunho tem override por
   MAC em três controles e o global no quarto; a pintura mostra os quatro
   valores certos. **A mordida:** devolva a chamada única a
   `effective_triggers_for(alvo_de_edicao(self).uniq)` e o teste reprova com as
   quatro colunas idênticas.
2. **O gesto vai para o MAC da coluna.** Mudar o modo na coluna do P3 manda um
   `trigger.set` com `uniq` = o MAC do P3, e **nenhum** pedido sai para os
   outros três. Tire o `uniq=` da chamada e o teste reprova mostrando quatro
   destinos. (É o mesmo defeito que a ABAS-06 curou uma vez no "Desligar":
   *"com 'Controle 2' selecionado, 'Desligar' zerava o gatilho dos QUATRO"*.)
3. **O override vai para o controle certo no rascunho** —
   `draft.controllers[uniq_p3].triggers.left.mode` mudou e
   `draft.triggers.left.mode` **não**. Grave no global e o teste reprova.
4. **O outro lado do mesmo controle sobrevive.** Editar o L2 do P2 não toca o R2
   do P2 — é o merge POR LADO de `effective_triggers_for` (`draft_config.py:1119`),
   e o teste o cobra por fora.
5. **Nenhuma coluna cai no ramo "Todos".** Espionar
   `with_override_fields_cleared` e exigir **zero** chamadas em toda a suíte de
   gestos de coluna. Faça uma coluna mandar `uniq=None` e o teste reprova —
   porque essa chamada **apaga o lado editado dos overrides de todo mundo**.
6. **A faixa e a porcentagem vêm do produto** — para cada barra pintada,
   `pct == round((valor - min) / (max - min) * 100)` com `min`/`max` lidos de
   `get_spec(modo)`. Digite uma faixa no teste e a régua morre; o comentário no
   arquivo diz isso.
7. **Mesa vazia não escreve nada** — zero colunas, zero RPC, nenhuma exceção.

## O que é dela decidir

1. **Sem a fita, some o jeito de editar "Todos".** Hoje, com a fita em "Todos",
   um gesto grava na seção **global** e vale para todo controle — inclusive para
   os que **não estão na mesa agora**. Com uma coluna por controle esse caminho
   **não tem mais gesto na tela**: um controle guardado na gaveta não pode ser
   configurado.
   Três saídas, e é dela: **(a)** volta como botão *"o mesmo nos quatro"*;
   **(b)** volta como chip vivo na fita, ao lado dos outros; **(c)** acaba, e
   quem quiser o mesmo nos quatro repete o gesto quatro vezes.
   O caminho do código continua vivo em qualquer uma delas — o que falta é o
   gesto.
2. **O toque ao vivo de 300 ms, agora vezes oito.** `_schedule_live_preview`
   (`:322`) aplica o modo no controle 300 ms depois do gesto: **ler um modo custa
   senti-lo na mão**. Com quatro colunas são oito caixas escorregando ao mesmo
   tempo, e quem sente é quem estiver com **aquele** controle — não
   necessariamente ela. Fica, some, ou vira um botão? A pergunta é de 27/08
   (`O-REDESENHO:299`) e continua aberta; a mecânica está na sprint **08**.
