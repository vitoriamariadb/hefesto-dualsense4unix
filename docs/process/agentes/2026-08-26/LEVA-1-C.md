# LEVA-1-C — a aba Lightbar para de adivinhar e pergunta ao daemon (BG-01)

## O que mudou

A aba Lightbar decidia "Cor enviada" x "guardada" pela **heurística do estado
da janela** (`alvo_fora_da_mesa`, `modo_nativo_manda_no_output`), jogando fora o
corpo do daemon — que traz `aplicado_em`/`guardado_em` desde a
APLICAR-VERDADE-01 — porque a ponte usada devolvia só `bool`. É a rota que a
bancada mediu em 23/08: zero destino, tela verde. E a **mesma aba** já lia o
daemon no outro ramo (`apply_draft_detalhado`): duas verdades sobre o mesmo
gesto numa tela só.

Agora o corpo do daemon decide, e as três leituras da janela viram
**explicação** em vez de decisão.

**`src/hefesto_dualsense4unix/app/actions/lightbar_actions.py`**

- as cinco chamadas trocaram de ponte: `led_set` → `led_set_detalhado` (o
  "Aplicar no controle", o "Apagar" e o funil por MAC do "Todos") e
  `player_leds_set` → `player_leds_set_detalhado` (as duas rotas de
  `_enviar_player_leds`). `None` do daemon é o `False` de ontem, palavra por
  palavra;
- `_enviar_led_em_todos` devolve `(ok, corpo)` e `_enviar_player_leds` devolve
  `(ok, motivo, corpo)`;
- **`somar_os_corpos`** (novo): "Todos" manda N pedidos por MAC e recebe N
  respostas; a tela diz UMA frase. A soma une `aplicado_em` e `guardado_em` sem
  repetir MAC. Com dois controles na mesa e um caído, ela diz *aplicado em 2 e
  guardado em 1*; olhar só a primeira resposta diria metade da história;
- **`frase_do_envio`** (novo): chama `textos_de_aplicacao.frase_do_desfecho` —
  **o dono único da decisão, importado, não copiado** — e troca **só** o ramo
  do aplicado pela frase que esta aba já tinha. Nenhum texto novo de tela;
- o ramo COR-04 (`profile.apply_draft`, o degradado de "Todos" sem saber quem
  está na mesa) **continua na heurística**, e está dito no código: aquele corpo
  publica `applied`/`failed` e **não publica destino** — não há o que ler. Ver
  "o que sobrou".

**A ÚNICA exceção, e ela é medida, não preferência:** com o **co-op ligado**, o
desenho das 5 luzes continua decidindo pela janela. Motivo: `apply_output_for`
escreve o campo cru e devolve `"escreveu"` → o daemon responde
`aplicado_em: [uniq]` — e no mesmo handler o `reassert_resolved_outputs`
reescreve o desenho do co-op por cima, porque a camada dele vence a manual no
merge por campo (R-13). O daemon diz a verdade sobre o **byte**; quem sabe que
ele **não fica** é a janela. Entregar essa decisão ao corpo devolveria o toast
que contradiz o rótulo três centímetros acima — o defeito que a MESA-CHEIA-09
mediu e curou. A régua dela (`test_com_o_coop_ligado_o_toast_e_o_rotulo_dizem_o_mesmo_dono`)
ficou vermelha na primeira volta desta cura e foi ela que revelou o buraco.

**Por que a palavra continua sendo "enviada" e não "aplicado":**
LIGHTBAR-BT-RESET-01 (17-18/07, ainda em vigor em 09/08) — por Bluetooth o
firmware **aceita e ignora** a escrita de cor; 330 mil escritas com a barra
apagada. `frase_do_desfecho` diz "aplicado"; esta aba tem uma decisão medida
registrada em `_TOAST_COR_ENVIADA` que diz o contrário, e decisão medida não se
desfaz em silêncio. `frase_do_envio` é exatamente essa costura, com régua
própria contra a divergência das duas formas.

**Portão de lápides** (só o bloco desta frente): `led_set_detalhado` e
`player_leds_set_detalhado` saíram na mesma edição que os ligou. Entraram
**duas** no lugar — `led_set` e `player_leds_set`, os invólucros estreitos que
ficaram sem chamador. Era previsível, está declarado, e a poda é de quem tem
posse do `app/ipc_bridge.py` (`nao_toca` desta leva). Mesma forma do
`trigger_reset` de 25/08.

## Qual mordida prova

`tests/unit/test_aplicar_verdade_ponte_lightbar.py` — seis testes novos. O
principal é `test_zero_destinos_nao_vira_cor_enviada`: o daemon responde
`{"aplicado_em": [], "guardado_em": [uniq]}` com a janela num estado que a
heurística leria como "aplicado" (alvo escolhido **na** mesa, Modo Nativo
desligado, co-op desligado).

**Cura ARRANCADA** (os três `frase_do_envio(...)` de volta para
`frase_de_guardado(alvo_ausente=alvo_fora_da_mesa(self), ...) or <frase feliz>`):

```
E       AssertionError: o daemon disse que NADA saiu no fio e a tela afirmou que a cor foi.
E           daemon    : aplicado_em=[] guardado_em=['aabbcc000001']
E           a tela diz: 'Cor enviada ao controle (80% de brilho)'
E           heurística: 'Cor enviada ao controle (80% de brilho)'  <- a frase que a adivinhação devolve

E       AssertionError: assert 'guardado' in 'Lightbar apagada'
E       AssertionError: assert 'guardado' in 'Desenho das luzes atualizado — LEDs acesos: 2 e 4'

FAILED tests/unit/test_aplicar_verdade_ponte_lightbar.py::test_zero_destinos_nao_vira_cor_enviada
FAILED tests/unit/test_aplicar_verdade_ponte_lightbar.py::test_as_duas_listas_vazias_dizem_que_ninguem_recebeu
FAILED tests/unit/test_aplicar_verdade_ponte_lightbar.py::test_o_apagar_tambem_pergunta_ao_daemon
FAILED tests/unit/test_aplicar_verdade_ponte_lightbar.py::test_as_cinco_luzes_do_jogador_tambem_perguntam
4 failed, 13 passed in 0.45s
```

**Cura DEVOLVIDA:**

```
.................                                                        [100%]
17 passed in 0.38s
```

A mordida **gêmea** está junta e é o que impede a cura de avançar longe demais:
`test_com_o_daemon_dizendo_aplicado_a_frase_e_a_de_sempre` exige que, com
`aplicado_em` cheio, o toast volte a ser palavra por palavra
`"Cor enviada ao controle (80% de brilho)"`. Sem ela, uma cura que dissesse
"guardado" sempre passaria no teste de cima.

E `test_a_regua_do_ramo_aplicado` guarda o único acoplamento real de
`frase_do_envio`: no dia em que `frase_do_desfecho` mudar a forma da frase do
aplicado, ele reprova — em vez de a palavra que esta aba recusa aparecer na tela
dela.

**Escopo inteiro, verde** (23 arquivos, tudo que toca a aba, a ponte e o
vocabulário): `473 passed, 2 xfailed`. O portão de lápides sozinho:
`35 passed`.

## O que NÃO verifiquei

- **Nada na bancada.** Zero aparelho, zero daemon vivo, zero `hidraw`. Tudo
  aqui é dublê. Que o daemon **de verdade** devolva `guardado_em` nos casos que
  os dublês reproduzem está lido no fonte
  (`ipc_handlers._destinos_por_uniq` + `backend_pydualsense.apply_output_for`),
  **não medido ao vivo nesta frente**;
- **a tela.** Não fotografei aba nenhuma (R-C proíbe `retratar_abas.py`). As
  frases estão provadas como string; **como elas ficam no rodapé de uma linha
  da `Gtk.Statusbar` não foi visto por mim**. A nota de 14/08 em
  `test_mesa_cheia_09_toasts_honestos` já mede que a frase de três pendências
  não cabe e é cortada — isso não mudou, e não piorei nem melhorei;
- **a suíte inteira.** Não rodei (regra da casa). Rodei 23 arquivos por
  caminho: todo teste que cita `lightbar_actions`, `textos_de_aplicacao` ou
  `frase_do_desfecho`, mais o portão de lápides;
- **o co-op na rota da COR.** Afirmo, com base em
  `_COOP_LAYER_FIELDS == ("player_leds",)` (que um teste da casa já fixa), que
  o co-op não governa a cor. Não medi isso ao vivo;
- **se a frase nova aparece igual em pt-BR na tela dela.** Nenhum texto foi
  inventado — todas as frases já estavam em produção —, mas a COMBINAÇÃO
  "corpo do daemon escolhe" pode fazer aparecer, num gesto, uma frase que antes
  só aparecia noutro. Isso é para o olho dela.

## O que sobrou para o próximo

1. **A rota COR-04 continua adivinhando, e é a última.** O
   `profile.apply_draft` publica `applied`/`failed` e **não** publica
   `aplicado_em`/`guardado_em` — a aba não tem o que ler ali. Fechar isso é do
   lado do **daemon** (`_handle_profile_apply_draft` passar a devolver os
   destinos), não da janela. É o caminho degradado de "Todos" quando a GUI
   ainda não sabe quem está na mesa, e some sozinho no tique seguinte.
2. **`app/ipc_bridge.py::led_set` e `::player_leds_set` estão sem chamador**, e
   entraram no registro de lápides com o endereço e a poda escritos. Não podei:
   `app/ipc_bridge.py` está no `nao_toca` desta leva e os dois são símbolo
   público no `__all__`. **DONO: a leva que tiver posse do `ipc_bridge`.**
3. **A exceção do co-op merece decisão dela.** Hoje a aba diz *"guardado; com o
   co-op ligado, quem manda nas 5 luzes é ele"* mesmo quando o byte saiu — o que
   é honesto, porque ele não fica. A alternativa (o daemon reportar
   `guardado_em` quando uma camada acima vence o campo) é conserto de daemon e
   apagaria a exceção da janela inteira. Está escrito no código, no lugar onde
   se decide.

### FORA DA POSSE — relatado, não escondido

A posse desta frente era `lightbar_actions.py`, `test_aplicar_verdade_ponte_lightbar.py`
e dois blocos do portão de lápides. **Editei mais 10 arquivos de teste**, e a
razão é uma só: eles selam a saída da aba com `monkeypatch.setattr(lightbar_actions,
"led_set"/"player_leds_set", ...)`. Trocada a ponte, **74 testes em 11 arquivos**
caíram — 40 deles com `AttributeError` na própria linha do `monkeypatch`.
Entregar a cura com 74 vermelhos não é entregar. O precedente da casa é o commit
`a99116a5` (25/08), onde a frente gêmea dos Gatilhos fez a mesma troca e mexeu
no `test_triggers_actions.py`, que também não era posse dela.

Nenhum destes arquivos está na posse de nenhuma das sete frentes da LEVA-1 nem
no `nao_toca` dela. **Quem integra decide se aceita.**

| arquivo | o que mudou |
|---|---|
| `test_abas01_conflito_entre_abas.py` | dublê passa a devolver o corpo do daemon |
| `test_lightbar_aplica_ao_soltar.py` | o espião devolve corpo; `resposta=False` virou `respondeu=False` |
| `test_lightbar_auto_colors.py` | idem, 5 dublês |
| `test_lightbar_onda7_as_mordidas.py` | idem, 3 dublês |
| `test_lightbar_todos_o_desenho_de_cada_um.py` | idem, 4 dublês |
| `test_lightbar_todos_por_mac_r14.py` | idem, 4 dublês (um deles recusa por MAC) |
| `test_player01_um_numero_de_jogador.py` | idem, 3 dublês |
| `test_tela_so_afirma_o_que_sabe_01.py` | `_selar_led_set` passa a falar o corpo |
| `test_z2_abas_leitoras_recusam.py` | o dublê que EXPLODE se houver IPC troca de nome |
| `test_r17_r18_uniq_e_sucesso_honesto.py` | a régua de fonte procura `led_set_detalhado(...)` |

**Três edições NÃO foram mecânicas, e cada uma leva nota datada no arquivo:**

- **`test_mesa_cheia_09_toasts_honestos.py`** — o dublê `_ipc_mudo` dizia
  sempre `True`. Com a decisão vindo do corpo, um dublê que só sabe dizer "sim"
  seria uma régua que só sabe passar: ele afirmaria escrita onde o produto mede
  registro, e a aba repetiria a afirmação. Reescrevi-o como
  `_corpo_por_uniq`, que **reproduz `_destinos_por_uniq`**: na mesa →
  `aplicado_em`; fora da mesa ou em Modo Nativo → `guardado_em`. **29 testes,
  todos verdes, nenhuma asserção afrouxada.**
- **`test_sem_o_mapa_a_janela_nao_inventa_guardado`** — este a BG-01
  **inverteu**, e renomeei junto
  (`test_sem_o_mapa_a_janela_nao_promete_uma_volta_que_nao_conhece`). Ele
  nascia exigindo que a frase **não** dissesse "guardado", porque quem a dizia
  era a heurística e uma janela sem mapa estaria inventando. Agora quem diz é o
  **daemon**, que sabe — repetir a palavra dele não é invenção. O que a mordida
  guarda é a metade que continua sendo da janela: **sem o mapa ela não pode
  prometer a volta de um controle** ("voltar" não pode aparecer na frase).
- **`test_os_dois_modulos_que_o_importam_usam_a_mesma_palavra`** — a régua
  reprovava a string `"guardado` no fonte da aba. `somar_os_corpos` escreve
  `"guardado_em"`, que **não é a palavra da tela**: é o nome do campo do
  protocolo do daemon. A régua passou a ignorar `_em`. Reprovar quem lê o
  protocolo direito é pior que régua nenhuma — ensina a não acreditar nela.

### Portões

`bash scripts/portoes.sh --rapido` → **18 de 19 verdes**. O vermelho é
`colisao-de-sprints`, e ele **já estava vermelho antes desta frente** —
conferido com `git stash` na árvore limpa, mesmo resultado. São 16 colisões
entre o `2026-08-26-LEVA-1-*.md` e sprints de 24/08, nenhuma delas em arquivo
desta frente. Pelo mesmo motivo,
`tests/unit/test_portao_a_colisao_de_sprints_morde.py::test_nasce_reprovando_zero_na_arvore_de_verdade`
reprova antes e depois. É a frente **L1-G** que tem posse disso.
