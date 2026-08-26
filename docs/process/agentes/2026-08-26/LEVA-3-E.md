# LEVA-3-E — O recibo do gesto ganha régua, e ganha português

**Frente:** BG-TOAST-02 + BG-07c, fundidas. **Árvore:** `hefesto-voo/LEVA-3-E`,
branch `voo/LEVA-3-E`.

## O que mudou

### 1. O portão da palavra passa a ler o toast

`scripts/validar-palavra-de-tela.py` decide "isto é texto de tela?" por FLUXO: a
string tem de chegar a um ESCOADOURO. A lista tinha treze nomes e nenhum deles
continha "toast", e o toast é a **única** frase que a pessoa lê depois de
clicar. Entrou `ESCOADOUROS_DE_RECIBO`, com os catorze ajudantes de toast de
`app/` e **a posição exata** do argumento de cada um.

**Por que um dicionário de posições e não o `int` de `ESCOADOUROS`.** O ajudante
mais usado da família não cabe no molde de "posições iniciais":
`_status_toast(context, msg)` (`actions/base.py:346`) tem o texto na posição
**1** e um id de contexto de statusbar na **0** — e um desses ids é `"daemon"`,
o começo de um termo banido. Contar duas posições iniciais arrastaria os ids
para dentro do portão, que é o falso positivo que desliga portão em uma semana.
Cada entrada foi lida na assinatura do ajudante.

**O ganho de alcance, medido nesta árvore:** de **344 rótulos (288 únicos) para
420 (363)** — 75 textos que régua nenhuma lia. Nenhum id de contexto vazou (a
lista dos onze foi conferida contra os textos novos).

**Fica de fora, e a ausência está escrita no código:** `_toast_trigger`
(`triggers_actions.py:700`) não tem argumento de texto — ele COMPÕE a frase lá
dentro; e `toast_da_escolha` / `toast_do_relancamento` / `reconciliar_toast` /
`toast_da_troca_de_mascara` **devolvem** a frase em vez de mostrá-la.

**A dívida.** Ampliar o alcance deixou vermelho **UM** texto:
`profiles_actions.py:3237`, `"Falha (daemon offline?)"`. Ele foi trocado no
mesmo commit, e por isso `DIVIDA_DO_RECIBO` **nasce vazia** — com o número na
mão, escrito ao lado dela, e o mecanismo de poda ativo (entrada que não existe
mais em `app/` reprova pedindo a remoção). É o mesmo estado, e pelo mesmo
motivo, do `DIVIDA_DA_PALAVRA_01` do `.glade` desde 26/08.

### 2. Os dois toasts com a palavra aposentada

| onde | antes | agora |
|---|---|---|
| `profiles_actions.py:3237` | `Falha (daemon offline?)` | `Não consegui trocar de perfil — o Hefesto pode estar desligado.` |
| `daemon_actions.py:2253` | `Reiniciando daemon...` | `Reiniciando o Hefesto…` |

Nenhuma das duas é palavra nova: a primeira segue a irmã já escrita para o mesmo
desfecho em `footer_actions.py` (`"Não consegui aplicar o perfil — o Hefesto
pode estar desligado."`); a segunda usa o nome do botão que a dispara,
`"Reiniciar o Hefesto"` (`gui/main.glade:2805`), e casa com o recibo de sucesso
doze linhas abaixo, que já dizia `"Hefesto reiniciado."`.

### 3. Nenhuma seção chega crua ao rodapé — e uma CORREÇÃO DE FATO

**A ordem dizia que `keyboard`, `mouse` e `mic` chegavam crus. Medido: não
chegam.** O rodapé os tem em `footer_actions._NOMES_DE_SECAO` desde a
APLICAR-VERDADE-01, e a chave crua que sai de `relato_da_ativacao` atravessa
aquele mapa antes de virar frase. A frase que a ordem cita — *"Aplicado, menos:
keyboard."* — **não existe nesta árvore**; ela diz *"Aplicado, menos: teclado."*

O que chegava cru era outra coisa, e o defeito é de **GRAFIA**:

```
trigger              -> "Aplicado, menos: trigger."          <- CRU
led                  -> "Aplicado, menos: led."              <- CRU
speaker:<uniq>       -> "Aplicado, menos: speaker:0f8a."     <- CRU
rumble_passthrough   -> não aparecia NEM CRU (§4)
```

`trigger` e `led` estão **no singular** porque é o vocabulário que a trava
manual já usa (`profiles/manager.py:488`); o mapa do rodapé tem `triggers` e
`leds`, **no plural**, porque nasceu para o `profile.apply_draft`. Os dois mapas
estavam certos, e a frase saía errada — as duas grafias nunca se encontraram.
Este é o motivo de a régua nova ler a FRASE FINAL e não os mapas.

O conserto mora em `_NOMES_DAS_SECOES_DA_ATIVACAO` (`profiles_actions.py`), que
é o mapa declarado como COMPLEMENTO do rodapé — o lugar certo, e dentro da
posse: `footer_actions.py` não é minha e não foi tocado.

A medição depois do conserto, seção a seção, pela frase que sai na statusbar:

```
trigger     -> gatilhos          led         -> luzes
keyboard    -> teclado           mouse       -> mouse
suppression -> modo jogo         rumble_policy -> vibração
speaker     -> alto-falante      mic         -> microfone
speaker:<uniq>     -> alto-falante de um controle     (PROVISÓRIO)
rumble_passthrough -> vibração do jogo                (PROVISÓRIO)
secao_do_futuro    -> secao_do_futuro   (crua de propósito — ver abaixo)
```

Seção desconhecida continua saindo crua **de propósito**: é a decisão que
`footer_actions._lista_de_secoes` já tinha escrito — *"melhor um termo estranho
do que omitir que algo ficou de fora"* — e ela segue de pé. Há teste cobrando.

### 4. A vibração do jogo deixa de ser muda

`profiles/manager.py` chamava o `rumble_passthrough_applier`, **descartava o
retorno** e engolia a exceção num `logger.warning`: `resultado` não ganhava
chave nenhuma. Era a única muda das sete seções com applier. Consequência medida
na frase: com o passthrough caído, o rodapé dizia **"Perfil aplicado ao
controle."** — sem uma palavra sobre a vibração que não voltou para o jogo.
Ausência de notícia lida como sucesso, que é o padrão que esta casa já nomeou.

Agora ela responde como os cinco irmãos: `_estado_da_secao(...)` no caminho
feliz, `"falhou"` no `except`.

## Qual mordida prova

`tests/unit/test_a_regua_da_palavra_le_o_recibo.py` — 8 testes. Estado final:

```
$ .venv/bin/python -m pytest tests/unit/test_a_regua_da_palavra_le_o_recibo.py -q
........                                                                 [100%]
8 passed in 3.40s
```

### Mordida 1 — arrancado o `ESCOADOUROS_DE_RECIBO` (a lista virou `{}`)

`test_o_toast_passa_pela_regua` planta um módulo em `app/` cuja ÚNICA frase de
tela chega por `self._toast_profile(...)` e carrega `daemon offline`. Com a cura
arrancada:

```
>       assert codigo == 1, "o portão ficou verde com jargão dentro de um toast"
E       AssertionError: o portão ficou verde com jargão dentro de um toast
E       assert 0 == 1
tests/unit/test_a_regua_da_palavra_le_o_recibo.py:119: AssertionError
______________ test_o_funil_do_toast_nao_arrasta_o_id_de_contexto ______________
>       assert validador.ESCOADOUROS_DE_RECIBO["_status_toast"] == (1,)
E       KeyError: '_status_toast'
FAILED ...::test_o_toast_passa_pela_regua
FAILED ...::test_o_funil_do_toast_nao_arrasta_o_id_de_contexto
2 failed, 6 passed in 2.08s
```

O teste tem uma segunda metade que **prova quem viu**: com a lista esvaziada em
tempo de execução, a MESMA frase plantada dá `rc=0`. Sem isso, o vermelho da
primeira metade poderia vir de outro escoadouro, e a régua não mediria o que
promete.

### Mordida 2 — arrancadas três linhas de `_NOMES_DAS_SECOES_DA_ATIVACAO`

Comentadas `"trigger"`, `"led"` e `"rumble_passthrough"`:

```
>           assert _frase_do_rodape(chave) == f"Perfil ativado: Sackboy — Aplicado, menos: {nome}."
E           AssertionError: assert 'Perfil ativa..._passthrough.' == 'Perfil ativa...ação do jogo.'
E             - o, menos: vibração do jogo.
E             + o, menos: rumble_passthrough.
>       assert _frase_do_rodape("trigger").endswith("Aplicado, menos: gatilhos.")
E       AssertionError: assert False
E        +      where 'Perfil ativado: Sackboy — Aplicado, menos: trigger.' = _frase_do_rodape('trigger')
FAILED ...::test_nenhuma_secao_chega_crua_ao_rodape
FAILED ...::test_as_secoes_no_singular_tambem_tem_palavra
FAILED ...::test_a_vibracao_do_jogo_caida_aparece_na_frase
3 failed, 5 passed in 3.14s
```

A chave em inglês aparece dentro da frase em português, que é exatamente o
defeito. `test_nenhuma_secao_chega_crua_ao_rodape` também confere a COMPLETUDE
do mapa contra `SECAO_DO_APPLIER`: applier novo sem palavra de tela reprova no
dia em que nascer.

### Mordida 3 — arrancado o `resultado["rumble_passthrough"]` do manager

```
E       KeyError: 'rumble_passthrough'
tests/unit/test_a_regua_da_palavra_le_o_recibo.py:286: KeyError
E       AssertionError: Perfil ativado: Sackboy
E        +      = 'Perfil ativado: Sackboy'.endswith('Aplicado, menos: vibração do jogo.')
FAILED ...::test_a_vibracao_do_jogo_entra_no_relatorio
FAILED ...::test_a_vibracao_do_jogo_caida_aparece_na_frase
2 failed, 6 passed in 3.05s
```

A frase com a cura arrancada é `"Perfil ativado: Sackboy"` — **silêncio total**
sobre a seção caída. É o defeito impresso.

Cura devolvida nos três casos, `8 passed` de novo (saída no topo desta seção).

### O que mais rodou, e passou

```
tests/unit/test_palavra_de_tela_alcanca_o_python.py
tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py
tests/unit/test_regua_declaracao_nao_fluxo_z6_10.py
tests/unit/test_profile_rumble_policy.py
tests/unit/test_toda_secao_de_perfil_tem_quem_a_aplique.py
tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py
-> 62 passed in 9.84s

todos os arquivos de teste que citam os símbolos tocados (grep por
relato_da_ativacao | mensagem_de_ativacao | mensagem_do_salvar |
_NOMES_DAS_SECOES_DA_ATIVACAO | apply_emulation | _toast_daemon | _toast_profile)
-> 605 passed in 17.52s

tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py   (R-B)
-> 35 passed in 57.81s
```

### Os portões

```
$ git add -A && bash scripts/portoes.sh --rapido
18 verdes de 19 · ruff VERMELHO
```

**O `ruff` já estava vermelho antes desta frente, e não é meu.** Provado
trocando a árvore para o `HEAD` da branch (`git stash`): mesmos **3** erros,
mesmos arquivos.

```
E501 tests/unit/test_match_sem_caixa_e_sentinel_manual.py:275:101   (103 > 100)
E501 tests/unit/test_o_preset_nao_escolhe_a_mascara.py:63:101       (135 > 100)
E501 tests/unit/test_o_preset_nao_escolhe_a_mascara.py:85:101       (136 > 100)
```

Vêm do commit `c165485c` (*"as sete isenções da poda da fábrica"*): os
comentários `# noqa: acentuacao` empurraram três linhas além de 100 colunas — e
o `ruff` ainda avisa que `# noqa: acentuacao` não é diretiva válida para ele.
Nenhum dos dois arquivos é da minha posse; **não consertei**. Uma linha de E501
minha apareceu na primeira rodada e foi corrigida.

## O que NÃO verifiquei

- **A tela.** Não fotografei nada (R-C proíbe `retratar_abas.py` na frente).
  Todas as frases foram medidas pela FUNÇÃO que as monta, não na janela viva.
  As três frases novas nunca foram vistas na statusbar real, e a statusbar
  **trunca** — `footer_actions._MAX_SECOES_NO_TEXTO` corta em três seções e
  emenda "e mais N". `"alto-falante de um controle"` é a mais longa das onze e
  pode ficar apertada em meia tela; isso é para o olho dela.
- **A bancada.** Não toquei. Nenhuma ativação de perfil real, nenhum daemon
  vivo, nenhum controle. O caminho manager → IPC → janela foi exercido com
  `FakeController` e appliers dublês.
- **`profile.apply_draft`.** Só o caminho `profile.switch` foi medido ponta a
  ponta. O `apply_draft` usa as chaves plurais e o mapa do rodapé, que não
  toquei — mas não rodei a frase dele.
- **Os 68 toasts alimentados por VARIÁVEL.** A régua nova é estática: ela lê
  literal e constante de módulo. Toast que recebe uma variável (inclusive o que
  vem de `toast_da_escolha`, `reconciliar_toast` e irmãos) continua fora, e o
  ganho de 344→420 já é líquido desse limite. Quem alcança texto de execução é o
  portão irmão de widget montado.
- **`_toast_trigger`**. Deixado de fora por desenho (compõe a frase por dentro).
  Não medi o que a frase dele carrega hoje.
- **A suíte inteira.** Não rodei (regra da casa: é de quem coordena, em oito
  lotes, no fim). Rodei 8 + 62 + 605 + 35 testes por caminho.
- **O `po/`**. Os catálogos de tradução não são varridos por este portão, e as
  frases trocadas não foram procuradas lá.

## O que sobrou para o próximo

### PARA ELA — duas palavras de tela, marcadas `PROVISÓRIO — decisão dela`

1. **`speaker:<uniq>` → "alto-falante de um controle".** A frase não diz QUAL
   controle, e a limitação é honesta em vez de escondida. O léxico da casa é
   `"Controle {N}"` (`widgets/controller_card.py:1033`), e o número do slot **não
   está ao alcance**: `relato_da_ativacao` é função pura, recebe só a resposta
   do daemon, e o mapa `uniq -> índice` mora no mixin (`_target_uniq_by_index`).
   As duas saídas, e nenhuma é redação:
   - **(a)** aceitar a frase genérica — custo zero, ela não sabe qual controle;
   - **(b)** levar o mapa até `relato_da_ativacao` — muda a assinatura e os
     chamadores, e vira `"alto-falante do Controle 2"`. É decisão de desenho.
2. **`rumble_passthrough` → "vibração do jogo".** Deriva do que já existe:
   "vibração" é o nome da irmã `rumble_policy` ao lado, e o botão que liga a
   seção se chama `"Deixar o jogo controlar a vibração"`
   (`gui/main.glade:2028`). A irmã e ela aparecem na mesma frase quando as duas
   caem — "Aplicado, menos: vibração, vibração do jogo." —, e é isso que quero
   que ela olhe.

**Relatadas também, sem `PROVISÓRIO` no código porque a troca já estava escrita
na casa** (mas ela decide, e é uma linha para o
`2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md`):

3. `"Não consegui trocar de perfil — o Hefesto pode estar desligado."`
4. `"Reiniciando o Hefesto…"`

### PARA QUEM COORDENA

- **O `ruff` está vermelho no `HEAD` desta branch**, por três E501 em
  `tests/unit/test_o_preset_nao_escolhe_a_mascara.py` (63, 85) e
  `tests/unit/test_match_sem_caixa_e_sentinel_manual.py` (275), vindos de
  `c165485c`. Fora da minha posse. Conserto: quebrar as três linhas, ou mover o
  `# noqa: acentuacao` para a linha de cima. **Vai bater no CI.**
- **A ordem da frente carregava um fato errado**, e ele está substituído aqui e
  no comentário de `_NOMES_DAS_SECOES_DA_ATIVACAO`: `keyboard`, `mouse` e `mic`
  **não** chegam crus ao rodapé, e a frase *"Aplicado, menos: keyboard."* não
  existe nesta árvore. O que chegava cru era `trigger`/`led` no singular e
  `speaker:<uniq>`. Vale corrigir onde a lista de bugs mora, senão a próxima
  frente reabre um defeito consertado.

### PARA UMA PRÓXIMA FRENTE (relatado, não feito — fora da posse)

- **`footer_actions.py` tem duas grafias para a mesma seção.**
  `_NOMES_DE_SECAO` guarda `triggers`/`leds` e o manager escreve
  `trigger`/`led`. O conserto de hoje é do lado de cá, e é o certo (o mapa do
  rodapé é dono da frase e não deve ganhar apelidos). Mas as duas grafias
  continuam vivas, e a próxima seção que nascer no singular vai cair no mesmo
  buraco. Uma nota no `_NOMES_DE_SECAO` apontando para cá custaria duas linhas.
- **`DIVIDA_DA_PALAVRA_01_PY` tem três entradas vivas**, duas delas em
  `footer_actions.py` (`"ERRO ao aplicar perfil (daemon offline?)."` e a que
  cita o botão `Restaurar Default`) e uma em `compact_window.py`
  (`"Daemon offline"`). As três são redação de tela e nenhuma é da minha posse.
- **O portão de recibo entrar em `scripts/portoes.sh`.** Ele NÃO precisa: a
  régua nova mora dentro do `validar-palavra-de-tela.py`, que já é o portão
  `palavra-de-tela` da lista, e o arquivo de teste entra pela suíte. Nenhuma
  linha nova foi pedida (R-D respeitada).
