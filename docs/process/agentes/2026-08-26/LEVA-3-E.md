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
speaker:<uniq>     -> alto-falante de um controle (<uniq>)   (PROVISÓRIO)
rumble_passthrough -> vibração do jogo                       (PROVISÓRIO)
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

Agora ela FALA quando cai: `"falhou"` no `except`, e o estado que o applier
souber dizer no caminho feliz.

**FATO ERRADO, SUBSTITUÍDO (26/08, na volta da conferência).** Esta linha dizia
*"Agora ela responde como os cinco irmãos: `_estado_da_secao(...)` no caminho
feliz"*. Responder como os irmãos era o defeito, não a cura — ver §5.1.

### 5. A VOLTA DA CONFERÊNCIA — as duas regressões que o `c41f6d78` trouxe

A entrega foi **devolvida**. O commit `05bc35af` (§1 e §2) passou limpo; o
`c41f6d78` (§3 e §4) trouxe duas regressões que a suíte inteira não viu, e a
razão é a mesma nas duas: **nenhuma régua ligava o manager à frase**.
`test_aplicar_verdade_02` monta o payload à mão e nunca passa por
`apply_emulation`, e o meu teste da vibração do jogo usava um dublê que não se
parece com o applier real. A costura não tinha régua. Agora tem.

#### 5.1 `"Nada foi aplicado ao controle."` tinha virado código morto

`lifecycle.apply_profile_rumble_passthrough` devolve `None` em **todos** os
caminhos — o feliz e os três no-op de saída antecipada —, e
`_estado_da_secao(None)` lê isso como `"aplicado"`. O applier está **sempre**
ligado em produção (`daemon/connection.py`) e o bloco novo do manager era
incondicional: `applied` nunca mais ficava vazio, e o
`if isinstance(aplicadas, list) and not aplicadas: return "Nada foi aplicado ao
controle."` de `footer_actions._mensagem_de_aplicacao` deixou de ser alcançável.

Medido por mim no cenário da APLICAR-VERDADE-02 (jogo aberto, gate R-04 adiando
toda seção — `mouse_applier` devolvendo `ADIADO_JOGO_ABERTO`, o applier real de
passthrough injetado):

```
ANTES do c41f6d78:  Perfil ativado: Sackboy — Nada foi aplicado ao controle.
COM o c41f6d78:     Perfil ativado: Sackboy — Aplicado, menos: mouse.
DEPOIS do conserto: Perfil ativado: Sackboy — Nada foi aplicado ao controle.
```

É a janela comemorando depois de nada ter chegado ao controle — o defeito que a
APLICAR-VERDADE-02 e a P3b de 25/08 existem para matar. Vale igual no **Salvar**,
que reusa `_mensagem_de_aplicacao`.

**O conserto** (`profiles/manager.py`, dentro da posse): só entra no relatório o
que o applier **soube dizer** — um estado do vocabulário do `lifecycle` — ou a
exceção, que é notícia de verdade. `None` é "este applier não sabe", e silêncio
de quem não sabe continua silêncio. A seção continua falando quando cai, que era
o ganho de §4; o que sai é o carimbo de sucesso que ninguém emitiu.

Por que esta seção diverge do `_estado_da_secao` das seis irmãs, e a divergência
está escrita no código: nas irmãs `None` é dublê de teste, e o daemon real
devolve string; aqui `None` é o **daemon real**.

#### 5.2 Os alto-falantes por controle se fundiam num rótulo só

`relato_da_ativacao` monta `failed` como um dict indexado pelo **nome
traduzido** — nome igual é a mesma entrada. Com um rótulo fixo, todo
`speaker:<uniq>` virava a mesma string e as peças colapsavam. Isso contraria a
decisão escrita 16 linhas ACIMA do ponto que a ordem citava, em
`ProfileManager.apply_controller_speakers`: *"Chave distinta da `speaker` global
de propósito, para a GUI conseguir dizer QUAL peça foi ignorada pela trava
manual em vez de fundir tudo num rótulo só."*

Medido por mim, com três alto-falantes caídos:

```
ANTES do c41f6d78:  ... menos: speaker:aabbcc000001, speaker:aabbcc000002,
                              speaker:aabbcc000003.          (feio, completo)
COM o c41f6d78:     ... menos: alto-falante de um controle.  (bonito, e dois
                                                              controles sumiram)
DEPOIS do conserto: ... menos: alto-falante de um controle (aabbcc000001),
                              alto-falante de um controle (aabbcc000002),
                              alto-falante de um controle (aabbcc000003).
```

**O conserto**: `nome_da_secao_da_ativacao` mantém o `uniq` no nome. A ordem
original apontava para cá (*"quando a mesa tem quatro"*) e a entrega respondeu a
metade do NOME e não a da CONTAGEM. Com quatro controles a frase corta em três
(`_MAX_SECOES_NO_TEXTO`) e a quarta peça vira **"e mais 1"** — contada, em vez de
desaparecida.

### 6. As duas ressalvas menores da conferência, as duas consertadas

**(a) `test_o_funil_do_toast_nao_arrasta_o_id_de_contexto` era teste de
DECLARAÇÃO** — afirmava que a constante era igual a si mesma. A conferência
testou o dano que ele nomeia (`_status_toast: (0, 1)` + portão): `rc=0`. **Eu
refiz a medição e bate: `rc=0`.** Nenhum id de contexto vivo (`"daemon"`,
`"footer"`, `"profiles"`) contém termo banido — `JARGAO_BANIDO` tem `"daemon
offline"`, de duas palavras —, então a árvore de hoje não consegue demonstrar o
dano sozinha. O teste agora planta um módulo com jargão **nas duas posições** do
funil e mede QUAL das duas o portão pega. Ver a Mordida 6.

**(b) O fixture `recibo_plantado` escrevia dentro de `src/…/app/`.** A suíte
desta casa morre no meio por desenho documentado; se morrer ali, o `finally`
nunca roda, o módulo sobrevive, e todo `validar-palavra-de-tela.py --all`
posterior fica vermelho com um arquivo que ninguém escreveu — encenado pelo
`git add -A` dos portões. Agora ele planta em `tmp_path` e os testes chamam
`conferir_app(raiz=...)`, que já aceitava a raiz. **O alcance não se perdeu:** a
regra é a mesma em qualquer raiz, e que a varredura de produção cubra `app/`
virou asserção explícita (`validador.APP == APP` e o `profiles_actions.py` real
dentro de `arquivos_de_python()`).

## Qual mordida prova

`tests/unit/test_a_regua_da_palavra_le_o_recibo.py` — **10 testes** (8 da
primeira volta, 2 da volta da conferência). Estado final:

```
$ python -m pytest tests/unit/test_a_regua_da_palavra_le_o_recibo.py -q
..........                                                               [100%]
10 passed in 1.25s
```

### Mordida 1 — arrancado o `ESCOADOUROS_DE_RECIBO` (a lista virou `{}`)

`test_o_toast_passa_pela_regua` planta um módulo cuja ÚNICA frase de tela chega
por `self._toast_profile(...)` e carrega `daemon offline`. Com a cura arrancada
(refeita em 26/08 contra os testes de agora):

```
>       assert acusacoes, "o portão ficou verde com jargão dentro de um toast"
E       AssertionError: o portão ficou verde com jargão dentro de um toast
E       assert []
>       assert len(acusacoes) == 1, acusacoes
E       AssertionError: []
E       assert 0 == 1
FAILED ...::test_o_toast_passa_pela_regua
FAILED ...::test_o_funil_do_toast_nao_arrasta_o_id_de_contexto
2 failed, 8 passed in 1.51s
```

O teste tem uma segunda metade que **prova quem viu**: com a lista esvaziada em
tempo de execução, a MESMA frase plantada não é acusada. Sem isso, o vermelho da
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
>       assert frase.endswith("Aplicado, menos: vibração do jogo."), frase
E       AssertionError: Perfil ativado: Sackboy — Aplicado, menos: rumble_passthrough.
FAILED ...::test_nenhuma_secao_chega_crua_ao_rodape
FAILED ...::test_as_secoes_no_singular_tambem_tem_palavra
FAILED ...::test_a_vibracao_do_jogo_caida_aparece_na_frase
3 failed, 7 passed in 1.34s
```

A chave em inglês aparece dentro da frase em português, que é exatamente o
defeito. `test_nenhuma_secao_chega_crua_ao_rodape` também confere a COMPLETUDE
do mapa contra `SECAO_DO_APPLIER`: applier novo sem palavra de tela reprova no
dia em que nascer.

### Mordida 3 — a seção do passthrough volta a ser MUDA no manager

Arrancados os dois relatos (o do caminho feliz e o `"falhou"` do `except`), que
é o estado anterior ao `c41f6d78`:

```
>       assert falante.apply_emulation(_perfil())["rumble_passthrough"] == ADIADO_LOCK_MANUAL
E       KeyError: 'rumble_passthrough'
>       assert frase.endswith("Aplicado, menos: vibração do jogo."), frase
E       AssertionError: Perfil ativado: Sackboy
FAILED ...::test_a_vibracao_do_jogo_entra_no_relatorio
FAILED ...::test_a_vibracao_do_jogo_caida_aparece_na_frase
2 failed, 8 passed in 1.33s
```

A frase com a cura arrancada é `"Perfil ativado: Sackboy"` — **silêncio total**
sobre a seção caída. É o defeito impresso.

### Mordida 4 — devolvido o `_estado_da_secao` ao passthrough (a regressão §5.1)

A cura do conserto é *"só entra o que o applier soube dizer"*. Arrancada — isto
é, com o `resultado["rumble_passthrough"] = _estado_da_secao(...)` do `c41f6d78`
de volta —, e com o applier **real** do daemon injetado:

```
>       assert frase == "Perfil ativado: Sackboy — Nada foi aplicado ao controle.", frase
E       AssertionError: Perfil ativado: Sackboy — Aplicado, menos: mouse.
E       assert 'Perfil ativa...menos: mouse.' == 'Perfil ativa... ao controle.'
E         - Perfil ativado: Sackboy — Nada foi aplicado ao controle.
E         + Perfil ativado: Sackboy — Aplicado, menos: mouse.
FAILED ...::test_a_vibracao_do_jogo_entra_no_relatorio
FAILED ...::test_o_applier_que_nao_sabe_nao_carimba_aplicado
2 failed, 8 passed in 1.37s
```

A asserção da FRASE vem primeiro no teste de propósito: é ela que a pessoa lê, e
é ela que a mordida tem de imprimir. O diff acima é o defeito, verbatim.

### Mordida 5 — devolvido o rótulo fixo do alto-falante (a regressão §5.2)

```
>       assert len(relato["failed"]) == len(_UNIQS_DA_MESA), relato["failed"]
E       AssertionError: {'alto-falante de um controle': 'falhou_escrita'}
E       assert 1 == 4
>       assert _frase_do_rodape("speaker:aa:bb:cc:00:00:ff").endswith(...)
E        +      where 'Perfil ativado: Sackboy — Aplicado, menos: alto-falante de um controle.'
FAILED ...::test_as_secoes_no_singular_tambem_tem_palavra
FAILED ...::test_o_alto_falante_de_cada_controle_e_uma_peca
2 failed, 8 passed in 1.30s
```

`1 == 4`: quatro alto-falantes caídos viram uma peça só. É a fusão impressa.

### Mordida 6 — alargado o funil do toast para `(0, 1)` (a ressalva **a**)

```
>       assert len(acusacoes) == 1, acusacoes
E       AssertionError: [... _contexto_plantado_pelo_teste.py:6: o texto de tela
E                        'daemon offline' ... contém o jargão 'daemon offline' ...]
E       assert 2 == 1
FAILED ...::test_o_funil_do_toast_nao_arrasta_o_id_de_contexto

$ python scripts/validar-palavra-de-tela.py --all   # com a MESMA cura arrancada
rc=0
```

As duas saídas juntas são o ponto: **o portão fica verde e só o teste novo pega**
— que é o que a conferência disse, e o que o teste velho (uma constante igual a
si mesma) não conseguia dizer.

Cura devolvida nos seis casos, `10 passed` de novo (saída no topo desta seção).

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

**Na volta da conferência**, com os dois consertos na árvore, os 22 arquivos de
teste que citam qualquer superfície tocada (`rumble_passthrough`,
`apply_emulation`, `relato_da_ativacao`, `nome_da_secao_da_ativacao`,
`apply_controller_speakers`, `palavra_de_tela`, `mensagem_de_ativacao`,
`mensagem_do_salvar`):

```
-> 417 passed in 21.39s
```

Inclui os quatro que a regressão §5.1 mais ameaçava —
`test_aplicar_verdade_02_a_contabilidade_do_aplicar.py`,
`test_ativar_nao_mente_01_o_botao_que_parecia_falhar.py`,
`test_p3_o_salvar_solta_a_thread_e_para_de_prometer.py` e
`test_aplicar_verdade_ponte_lightbar.py`.

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
  emenda "e mais N". `"alto-falante de um controle (<uniq>)"` é de longe a mais
  longa das onze, e com a mesa cheia a frase fica **muito** comprida: três
  repetições dela mais "e mais 1". A truncagem é o que segura o tamanho, e o
  teste cobra o "e mais 1" — mas **o quanto isso cabe em meia tela é para o olho
  dela**, e é a primeira coisa que eu mostraria.
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
  lotes, no fim). Rodei 10 + 62 + 605 + 35 + 417 testes por caminho.
- **O `po/`**. Os catálogos de tradução não são varridos por este portão, e as
  frases trocadas não foram procuradas lá. O nome do alto-falante por controle
  passou a ser montado com f-string (`"alto-falante de um controle ({uniq})"`),
  então o que existe para traduzir é o pedaço fixo — não conferi o catálogo.
- **As outras seis seções com applier.** O conserto de §5.1 é só do
  `rumble_passthrough`, porque é dele que o applier real devolve `None`. **Não
  auditei os outros seis appliers do daemon** para ver se algum também devolve
  `None` em produção e carimba "aplicado" sem ter aplicado. É a mesma classe de
  defeito, e a régua para ela não existe (ver "o que sobrou").

## O que sobrou para o próximo

### PARA ELA — duas palavras de tela, marcadas `PROVISÓRIO — decisão dela`

1. **`speaker:<uniq>` → "alto-falante de um controle (`<uniq>`)".** A frase diz
   qual controle pelo IDENTIFICADOR, não pelo número do slot, e é feia. O
   `uniq` está lá por necessidade, não por escolha: sem ele as peças se fundem
   numa entrada só e três controles somem da frase (§5.2). O léxico da casa é
   `"Controle {N}"` (`widgets/controller_card.py`), e o número **não está ao
   alcance**: `relato_da_ativacao` é função pura, recebe só a resposta do
   daemon, e o mapa `uniq -> índice` mora no mixin (`_target_uniq_by_index`).
   As duas saídas, e nenhuma é redação:
   - **(a)** aceitar o identificador entre parênteses — custo zero, e feio;
   - **(b)** levar o mapa até `relato_da_ativacao` — muda a assinatura e os
     chamadores, e vira `"alto-falante do Controle 2"`, que é curto, bonito e
     diz a verdade. É decisão de desenho, e é a que eu recomendaria.
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
- **`_estado_da_secao(None) == "aplicado"` é uma armadilha para os outros seis
  appliers, e ela não tem régua** (achado da volta da conferência). A disciplina
  está escrita — *"quem não sabe adiar não pode fabricar um adiamento"* — e o
  reverso não está: **quem não sabe aplicar fabrica uma aplicação**. Foi assim
  que a §5.1 nasceu. O `rumble_passthrough` está consertado; os outros seis
  appliers do daemon não foram auditados. O que falta é um teste que percorra
  `SECAO_DO_APPLIER`, pegue o método REAL do daemon de cada um e reprove o que
  devolver `None` em todos os caminhos sem que o manager saiba disso. É posse do
  `manager.py` + `lifecycle.py` juntos, e por isso ficou de fora daqui.
