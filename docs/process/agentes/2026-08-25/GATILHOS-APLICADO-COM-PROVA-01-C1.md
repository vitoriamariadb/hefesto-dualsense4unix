# GATILHOS-APLICADO-COM-PROVA-01 — C1 — o corpo do daemon manda, e num ramo ele ainda inventa a causa

> **NOTA DE ORIGEM — este relatório é da CONFERÊNCIA, não do executor.**
> Escrito em 25/08/2026 por quem NÃO escreveu o código. A frente `41541a7`
> entregou em `dev` e não deixou relatório; a fonte aqui é o **diff** e a
> **mordida refeita**, nunca a memória de quem escreveu. Alegação que não pôde
> ser conferida está no terceiro cabeçalho — não sumiu. Árvore:
> `hefesto-voo/conferencia-C1-gatilhos`, com `source .envrc-voo` antes de todo
> python. Nada foi commitado; a árvore terminou limpa.

> **O ACHADO [ALTA] DESTE RELATÓRIO JÁ FOI CONSERTADO — 25/08/2026, por quem
> coordena, no mesmo dia.** A `NADA_ACONTECEU` deixou de ser uma frase só e
> virou **três**: a genérica (`"nenhum controle recebeu"`), a de mesa vazia e a
> de Modo Nativo. O ramo das duas listas vazias em `frase_do_desfecho` passou a
> consultar `modo_nativo_manda_no_output(host)` e uma `mesa_vazia(host)` nova —
> a mesma ordem de decisão que o ramo do corpo ausente já usava. Sobre os três
> caminhos que a janela **não** enxerga (índice ausente, exceção na leitura,
> alvo sem `uniq`), a frase agora cala em vez de diagnosticar.
>
> A mordida é `tests/unit/test_a_barra_nao_inventa_a_causa_do_nada.py`, provada
> nos DOIS sentidos: devolvendo a frase antiga à constante (2 reprovam) e
> apagando o ramo do Modo Nativo (1 reprova). Os 10 testes do dono da função
> (`test_z1_t1_frase_do_desfecho.py`) e os 56 da frente continuam verdes.
>
> **Os quatro achados restantes deste relatório continuam ABERTOS** e estão na
> fila: o daemon velho que colapsa "sem os campos" em "campos vazios", a mordida
> gêmea da T8 que só pega o esvaziar, a linha morta da régua da T3 e os dois
> `assert` sem mensagem.
>
> **Uma correção ao próprio relatório:** o achado [BAIXA] sobre o `ruff` diz que
> `ruff check .` é *"o comando exato do CI"*. **Não é.** O CI roda `ruff check
> src/ tests/` (`.github/workflows/ci.yml:475`), e é o mesmo comando do
> `scripts/portoes.sh:71` — os dois estão alinhados. O que o `CLAUDE.md` avisa é
> que as duas formas DIVERGEM, não que a de ponto seja a do CI. Os 3 erros
> continuam reais e continuam sem régua que os meça; a gravidade é que era
> outra, e nenhum deles reprova o CI de hoje.

---

## O que mudou

Commit único: `41541a7` — *"aplicado" vem de quem viu o byte, e cada modo se
explica*. Seis arquivos, dois de produto.

| arquivo | o que fez |
|---|---|
| `app/actions/triggers_actions.py` | T3: `_apply_trigger`, `_send_trigger_named` e `_reset_trigger` trocam `trigger_set_checked`/`trigger_reset` pelos `*_detalhado`; `_toast_trigger` recebe `corpo` e decide por `frase_do_desfecho`. T8: `sel.set_tooltips({spec.name: spec.description for spec in PRESETS})` |
| `app/actions/trigger_specs.py` | T8: `TriggerParamSpec.help_text` sai, com nota datada no docstring |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | três entradas saem do registro (`trigger_set_detalhado`, `trigger_reset_detalhado`, `frase_do_desfecho`); uma entra, declarada (`trigger_reset`, que ficou órfão) |
| `tests/unit/test_t3_o_aplicado_do_gatilho_vem_de_quem_viu.py` | novo, 15 nós |
| `tests/unit/test_t8_as_dezenove_frases_sem_aplicar_nada.py` | novo, 8 nós |
| `tests/unit/test_triggers_actions.py` | dublês seguem o produto (3-tupla), 33 nós |

**Exercícios da sprint `2026-08-24-GATILHOS-APLICADO-COM-PROVA-01`:** fecharam
**T3** e **T8**. Os outros dez (T1, T2, T4–T7, T9–T12) não foram tocados por
esta frente.

**O que verifiquei do que a frente AFIRMA, e bateu:**

- *"`trigger_set_checked` continua com caminho, `trigger_reset` não"* — bate.
  `grep -rn "\btrigger_set(" src/` → `cli/cmd_test.py:125` chama `trigger_set`,
  que chama `trigger_set_checked` dentro do próprio `ipc_bridge.py`. Já
  `trigger_reset` ficou com zero chamadores de produção.
- *"`gatilho.leitura` é não/não nos dois transportes"* — bate. Lido do
  `docs/data/mapa-controles.csv` com `csv.DictReader`:
  `gatilho.leitura@dualsense` tem `cabo_aciona=não`, `radio_aciona=não`. A aba
  realmente não pode dizer "confirmado no aparelho", e não diz.
- *"o mecanismo de dica por botão já tinha quatro chamadores"* — bate:
  `external_card.py:328`, `secao_orcamento.py:423`, `profiles_actions.py:1459`,
  `controller_card.py:3714`. Agora são cinco.
- *"73 parâmetros, 73 vazios, zero leitores"* — bate. `grep -rn help_text
  src/ tests/ scripts/` depois da remoção só acha o `# HELP` do Prometheus em
  `daemon/subsystems/metrics.py`, mais o docstring e o teste.

**Portões que rodei nesta árvore, verdes:**

```
pytest -q tests/unit/test_t3_...py tests/unit/test_t8_...py tests/unit/test_triggers_actions.py
    -> 56 passed in 0.83s   (15 + 8 + 33)
pytest -q tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
    -> 35 passed in 53.30s
pytest -q tests/unit/test_docs_mac_anonimato.py      -> 11 passed
python scripts/check_endereco_de_radio.py            -> OK
mypy src/hefesto_dualsense4unix                      -> Success: 221 source files
ruff check <os 6 arquivos da frente>                 -> All checks passed!
```

---

## Qual mordida prova

Protocolo da casa: arrancar a cura, ver reprovar, devolver. **Cinco arrancadas,
uma por alegação.** A árvore foi restaurada por cópia após cada uma
(`git status --short` vazio entre elas) e nada foi commitado.

### Mordida 1 — T3, o coração: `_toast_trigger` volta a deduzir

Arrancado: a linha `msg = frase_do_desfecho(f"{lado}: {preset_id}", corpo, self)`
trocada pelo bloco heurístico anterior (as três razões da janela decidindo).

```
pytest -q tests/unit/test_t3_o_aplicado_do_gatilho_vem_de_quem_viu.py
-> 5 failed, 10 passed in 0.42s
```

E **a mensagem diz o que está errado**, que é a metade da régua que costuma
faltar:

```
AssertionError: o daemon respondeu `aplicado_em: [], guardado_em: []` — zero
destino, nenhum byte no fio — e a barra afirmou aplicação
assert 'aplicado' not in 'Gatilho esquerdo (L2): Rigid aplicado'
```

Os cinco que caem são exatamente os que descrevem o defeito medido em 23/08 e
os ramos novos: mesa vazia no "Aplicar", mesa vazia no "Desligar", mesa vazia
pela rota `dict` (`_send_trigger_named`), a contagem de dois destinos e a
recusa que vem no corpo. **MORDE.**

### Mordida 2 — T3, a segunda régua: o portão, sozinho

Arrancado: `triggers_actions.py` inteiro voltou à versão de `41541a7^`
(chamadores estreitos de novo), **sem** devolver as entradas ao registro.

```
pytest -q tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
-> 2 failed, 33 passed in 51.81s
```

E ele reprova **nos dois sentidos**, que é o que a sprint pediu:

```
assert not ['app/ipc_bridge.py::trigger_reset_detalhado',
            'app/ipc_bridge.py::trigger_set_detalhado',
            'app/textos_de_aplicacao.py::frase_do_desfecho']
...
AssertionError: há 1 lápide(s) declarando símbolo como sem caminho enquanto
ALGO em produção já o alcança:
  - _SEM_CAMINHO_HOJE: app/ipc_bridge.py::trigger_reset
```

As três promessas voltam a ficar sem caminho **e** a lápide nova do
`trigger_reset` fica caduca no mesmo instante. As duas mordidas da T3 são de
fato independentes. **MORDE.**

Na mesma arrancada, os três arquivos de teste da frente: `36 failed, 7 passed,
13 errors` — os `errors` são o `monkeypatch.setattr` batendo em atributo
inexistente, que é o anúncio que o comentário do dublê promete.

### Mordida 3 — T8: `sel.set_tooltips(...)` fora

```
pytest -q tests/unit/test_t8_as_dezenove_frases_sem_aplicar_nada.py
-> 4 failed, 4 passed in 0.40s
AssertionError: a aba deixou de pedir as dicas
AssertionError: modos sem dica no botão: [...]
```

**MORDE**, e pelas duas pontas: o teste que lê o `get_tooltip_text()` do botão
GTK de verdade, e o que vigia a expressão no fonte da aba.

### Mordida 4 — T8, a ponta gêmea: mexer no `PRESETS`

Duas variantes, e **elas dão resultados diferentes**:

- **esvaziar** uma `description` (`Rigid` → `""`):
  `3 failed, 5 passed`. **MORDE.**
- **reescrever** a mesma `description` para outra frase não vazia:
  `8 passed`. **NÃO MORDE.**

A sprint prometia *"arranque uma descrição do `PRESETS` e o mesmo teste
reprova"*. Isso vale para a ausência, não para a troca — está no terceiro
cabeçalho e nos achados.

### Mordida 5 — T8: o campo morto volta

Devolvido `help_text: str = ""` ao `TriggerParamSpec`:

```
pytest -q tests/unit/test_t8_...py::TestOCampoMortoSaiu
-> 1 failed, 2 passed
AssertionError: assert not True
  where True = hasattr(TriggerParamSpec(..., help_text=''), 'help_text')
```

**MORDE.**

### Devolução

Depois das cinco: `git status --short` vazio e `pytest -q` dos três arquivos de
volta a `56 passed in 0.71s`.

---

## O que NÃO verifiquei

- **Nada com aparelho.** Zero DualSense na bancada durante esta conferência.
  Toda a frente é testada com dublê de ponte: o que está provado é *"a aba lê o
  corpo que o daemon devolveu"*, **nunca** *"o byte saiu"* nem *"o controle
  obedeceu"* — e o próprio mapa de canais diz que a segunda pergunta não tem
  resposta (`gatilho.leitura`, `aciona=não` nos dois transportes).
- **Não medi contra um daemon vivo.** Todos os corpos usados nos testes são
  literais escritos à mão. Que o `_handle_trigger_set` real devolva exatamente
  `{status, aplicado_em, guardado_em}` foi conferido **lendo o fonte**
  (`daemon/ipc_handlers.py:1186` e `:1235`), não vendo o socket.
- **Não fotografei a aba.** A regra da leva proíbe rodar `retratar_abas.py` num
  agente. Então **não vi** as 38 dicas na tela: o que vi foi
  `get_tooltip_text()` de `Gtk.RadioButton` reais, fora de toplevel. Se a dica
  aparecer atrás de outro widget, ou se 19 frases longas estourarem o balão,
  isso não foi medido. **O Bloco 2 do aceite da sprint continua ABERTO.**
- **Não medi o `Rigid` no plástico.** A sprint e a canônica registram que dos 19
  modos só o `Rigid` foi sentido, com um jogo de parâmetros. Esta frente não
  muda isso e eu não mudei.
- **Não rodei a suíte inteira** (regra da leva) nem `scripts/portoes.sh`. Rodei
  os arquivos da frente, o portão de promessa, os dois portões de MAC, os três
  validadores de texto, `mypy` e `ruff`.
- **Não conferi a palavra `NADA_ACONTECEU` com ela.** O texto está marcado
  `PROVISÓRIO — decisão dela (D3)` no próprio módulo, e a T3 é **estrutural**
  pelo carimbo da sprint: espera o olho dela. Não sei se ela já viu.

---

## O que sobrou para o próximo

Cinco achados. O primeiro é o que eu levaria para quem coordena antes de
qualquer outra coisa.

### 1. ALTA — a frase de "nada aconteceu" AFIRMA uma causa que a janela não pode saber, e no Modo Nativo ela é FALSA

`frase_do_desfecho`, ramo 3 (as duas listas vazias com corpo presente), devolve:

    <assunto> — nenhum controle recebeu — não há controle na mesa

Só que `_destinos_do_broadcast` (`daemon/ipc_handlers.py:1109-1184`) devolve
`([], [])` em **cinco** situações distintas, e **uma só** delas é mesa vazia:

1. `not alvos` — mesa vazia (`:1160`);
2. **`daemon.is_native_mode()` — Modo Nativo ligado, com controle NA mesa** (`:1162`);
3. `get_output_target_index` ausente no controller (`:1168`);
4. exceção ao ler o índice do alvo (`:1173`);
5. `get_output_target_uniq` vazio — alvo sem MAC estável (`:1183`).

Nos casos 2 a 5 a barra **mente**, e o caso 2 é rotina na mesa dela. Pior: é um
caso que o código **antes** deste commit acertava. Medido nesta árvore, com a
cura no lugar (script em
`scratchpad/C1-conferencia/prova_nativo.py`, host com `nativo=True`,
um controle conectado, alvo "Todos", corpo `{status: ok, aplicado_em: [],
guardado_em: []}`):

```
modo_nativo_manda_no_output(host) = True
FRASE HOJE  -> Gatilho esquerdo (L2): Rigid — nenhum controle recebeu — não há controle na mesa
FRASE ANTES -> Gatilho esquerdo (L2): Rigid — guardado; em Modo Nativo quem manda
               no controle é o jogo. Vale quando o Modo Nativo sair.
```

E isso repete a cada clique de modo, não só no "Aplicar": `_schedule_live_preview`
chama `_apply_trigger` 300 ms depois de cada troca (`:322`), e o toast vai junto.

A mensagem do commit diz *"com corpo presente elas viram o PORQUÊ do
adiamento"*. Isso é verdade no ramo do `guardado_em` e **falso no ramo das duas
listas vazias**, onde a razão que a janela conhece é descartada e substituída
por uma afirmação que ela não pode fazer. É a classe de defeito que a sprint
existe para matar, com o sinal trocado: antes a tela dizia "aplicado" sem saber;
agora diz "não há controle na mesa" sem saber.

**O conserto natural:** no ramo 3, quando a janela tem razão conhecida (Modo
Nativo, alvo fora da mesa), dizê-la; e `NADA_ACONTECEU` deixar de embutir a
causa numa frase que também cobre outras quatro situações. O arquivo é
`app/textos_de_aplicacao.py`, que **não** é desta frente — é da ONDA0-Z1 —, mas
foi esta frente que pôs a frase na tela.

**Por que a régua não pegou:** `test_modo_nativo_continua_vencendo_com_o_daemon_mudo`
existe, e testa `corpo=None`. Não há um só nó com **Modo Nativo + corpo
presente**. A régua mede o ramo que não regrediu.

### 2. MEDIA — daemon mais velho que o código cai no mesmo buraco

`destinos_da_aplicacao` colapsa "respondeu sem os campos" e "respondeu com os
campos vazios" no mesmo `([], [])` (o docstring dele assume isso de propósito).
Um daemon vivo anterior à MESA-CHEIA-09 responde `{"status": "ok"}` seco — e a
aba passa a dizer "não há controle na mesa" com quatro controles no fio. É a
armadilha registrada desta casa (*o daemon vivo é mais velho que o código*, com
install editable a cura só vale no próximo start). O erro agora é pessimista em
vez de otimista, o que é melhor, mas continua sendo a tela afirmando o que não
sabe. Distinguir é possível: `"aplicado_em" in corpo` separa os dois.

### 3. MEDIA — reescrever uma das 19 frases passa verde

Medido acima (mordida 4): esvaziar uma `description` reprova; **trocá-la por
outro texto não reprova nada**. O carimbo da sprint diz *"se o executor
reescrever qualquer uma das 19, vira estrutural e espera o olho dela"* — e não
há régua que perceba. O executor **não** reescreveu nenhuma (conferido no diff
de `trigger_specs.py`: só sai o `help_text` e entra docstring), então a entrega
é honesta; o que falta é o portão que a sprint achava ter. Confirmado também
que hoje há **um dono só** para as 19 frases: `grep -rln "Barreira rígida numa
posição fixa"` devolve apenas `trigger_specs.py`.

### 4. BAIXA — uma linha da régua da T3 é vazia por construção

Em `test_a_aba_nao_importa_mais_os_involucros_de_bool`:

```python
assert "import trigger_set_checked" not in fonte
```

O estilo de import deste repositório é multi-import entre parênteses; a versão
**pré-cura** do arquivo contém `import trigger_reset, trigger_set_checked`, que
não casa com essa substring. A asserção passa verde com a cura arrancada —
provado na mordida 2, onde quem reprovou foi a linha seguinte
(`"trigger_set_detalhado" in fonte`) e o laço dos parênteses. Linha morta numa
régua é a mesma doença que o portão de promessa persegue.

### 5. BAIXA — dois `assert` sem mensagem na régua que lê o fonte

`assert "trigger_set_detalhado" in fonte` e `assert "frase_do_desfecho" in
fonte` não têm mensagem. Quando reprovam, o pytest despeja o módulo inteiro
(37 KB) no diff e não diz o que se esperava. O resto do arquivo tem mensagens
boas; estas duas ficaram meia-régua.

### Fora da frente, mas para quem integra

`ruff check .` — **o comando exato do CI** — está VERMELHO com 3 erros, todos
em `scripts/` e todos anteriores a esta frente (presentes em `fc0d385`):
`check_colisao_de_sprints.py:84` (N818) e `check_paridade_transporte.py:380`
e `:384` (RUF003/RUF001, o `×` ambíguo). Os seis arquivos desta frente passam
limpos; o vermelho é de outra pessoa e vai aparecer no CI da leva inteira.
