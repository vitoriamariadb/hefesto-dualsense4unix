# LEVA-3-F — O número medido tem um dono só

Nasce de BG-02 (o debounce do rumble lido de duas memórias) + BG-03 (a vírgula
do pt-BR escrita em três lugares).

## O que mudou

### BG-02 — a rota `rumble.set` passou a ler a memória VIVA

`daemon/ipc_rumble_policy.apply_rumble_policy` — a rota que o "Aplicar" da aba
Rumble e o IPC atravessam — lia o debounce do modo "auto" de
`daemon._rumble_engine._last_auto_*`. Esse atributo **não é instanciado em lugar
nenhum de `src/`**: a leitura começava sempre em `0,7 / 0,0` e o resultado era
descartado pelo `if rumble_engine is not None`. As outras duas rotas
(`subsystems/rumble.reassert_rumble`, o tique de 200 ms, e
`subsystems/gamepad._game_rumble_mult`, o force-feedback do jogo) usam
`daemon._last_auto_mult` / `_last_auto_change_at`, declarados em
`daemon/protocols.py`:82-84.

- `apply_rumble_policy` agora lê e escreve **a mesma dupla**, pelo mesmo idioma
  de `reassert_rumble` (atribuição direta).
- Nasceu `ipc_rumble_policy.memoria_viva_do_auto(daemon)`, com blindagem por
  `isinstance`: o daemon ali é `Any`, e boa parte dos dublês desta casa é
  `MagicMock`, que devolve um `Mock` para qualquer atributo — sem a blindagem,
  `now - last_auto_change_at` estouraria `TypeError` **dentro** de
  `_effective_mult`.
- O caminho morto saiu: nenhum `_rumble_engine` sobrou em `apply_rumble_policy`.

**Efeito no produto:** a intensidade que ela sente parava de depender de qual
rota mexeu por último. Com bateria caindo no meio da partida, o `rumble.set`
gravava 1,0 e o tique seguinte, 200 ms depois, achava que "nunca houve mudança"
e derrubava para 0,3 na hora — o pulo de força que o debounce existe para
impedir.

**Três frases erradas substituídas** (a irmã delas, em `ipc_handlers.py`, já
tinha sido corrigida em 24/08 e dizia a verdade):

| Onde | O que dizia |
|---|---|
| `daemon/ipc_rumble_policy.py`:5-7 | "Depende de `RumbleEngine.update_auto_state`" |
| `core/rumble.py::RumbleEngine.update_auto_state` | "Usado por chamadores externos (ex.: `_apply_rumble_policy` em `ipc_server.py`)" |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` (cabeçalho, armadilha 3) | apontava `ipc_handlers.py:2237`, endereço que não existe mais |

`core/rumble.py::RumbleEngine` ganhou, no próprio docstring, o aviso de que
**não é instanciada em `src/`** — para quem for ligar a política de vibração não
começar por ali.

### BG-03 — a vírgula tem um dono só

`260.4` → `260,4` era **três implementações independentes da mesma regra**:

| Arquivo | O que era |
|---|---|
| `app/fala_do_mapa.py::formata_pt_br` | o dono declarado, e a régua do portão do mapa já o importava |
| `app/actions/config/secao_controles.py::_numero` | cópia |
| `integrations/plano_de_radio.py::_numero` | cópia, com comentário prometendo *"mesma forma que…"* enquanto reescrevia a conta |

As duas cópias passaram a chamar `formata_pt_br`. **Saída idêntica ⇒ nenhum
texto mudou na tela** (há teste travando isso, `test_as_duas_convertidas_devolvem_o_que_o_dono_devolve`);
o que muda é que no dia em que o arredondamento mudar, duas células param de
discordar.

**Sobre `integrations/` importar `app/`:** o docstring de `plano_de_radio._numero`
justificava a cópia com *"`integrations/` não pode passar a depender de `app/`"*.
Medido antes de escrever a linha, e a razão está no código:
`app/fala_do_mapa.py` é **zero-dependência por contrato** — só stdlib, sem GTK,
sem nada do pacote (o `scripts/validar-fala-de-tela.py` depende disso: carrega o
arquivo por **caminho**, sem passar pelo `__init__` de `app/`, exatamente para
não transformar `ImportError` em "zero `Fala` encontradas"). E `plano_de_radio`
já é consumido só pela tela: o único importador dele em `src/` é
`app/actions/config/secao_orcamento.py`. Nada headless ganha dependência de
`app/`, e não há ciclo. O comentário vizinho do `SEM_NUMERO` — que repete a
frase do card em vez de importá-la — foi reescrito com a razão PRECISA:
`secao_controles` importa GTK, `fala_do_mapa` não.

### As lápides

- **`app/fala_do_mapa.py::formata_pt_br` APAGADA** — ganhou chamador; a lápide
  reprovaria em `test_nenhuma_lapide_sobreviveu_a_propria_cura`.
- **`app/fala_do_mapa.py::Numero` FICOU, com a razão substituída.** A ordem da
  frente mandava apagá-la ("cai junto com `formata_pt_br`"). **A medição
  derrubou a ordem:** ele continua órfão. Ver "O que sobrou".
- **`core/rumble.py::RumbleEngine` FICOU, com a razão substituída.** A ordem
  mandava apagá-la; ele continua sem instanciação em `src/`, e apagar a lápide
  com o símbolo órfão reprovaria em `test_toda_promessa_solta_esta_classificada`.
  O que a entrada ganhou é a **resposta** da pergunta que ela abriu em 12/08:
  *foi SUBSTITUÍDO*, e o que a fecha agora é apagar a classe.
- **O canário de `test_o_ponto_de_entrada_declarado_e_o_que_abre_o_alcance`
  trocado**, de `formata_pt_br` para `Numero`. O próprio comentário dele mandava:
  *"No dia em que alguém o fiar, esta linha reprova — e o conserto é trocar o
  canário de novo, não silenciar."* Foi o que aconteceu.

**Medição do portão de lápides:** 99 promessas soltas antes, **98** depois. A
diferença é exatamente `formata_pt_br`. `memoria_viva_do_auto`, símbolo público
novo, **não** engordou a lista: ele tem chamador no próprio módulo, que é
alcançado.

## Qual mordida prova

### BG-02 — `tests/unit/test_rumble_mult_um_dono.py`

Cinco casos novos. O principal bate `rumble.set` com a bateria cheia, derruba a
bateria e chama o poll loop **dentro** da janela de debounce.

**Com a cura arrancada** (leitura e writeback devolvidos ao `_rumble_engine`):

```
$ .venv/bin/python -m pytest tests/unit/test_rumble_mult_um_dono.py -q
E       AssertionError: a rota do `rumble.set` NÃO escreveu na memória viva do daemon:
        esperava (1.0, 1000.0), veio (0.7, 0.0). Esse par é o que `reassert_rumble` e
        `_game_rumble_mult` leem no tique seguinte — sem ele são duas contas para o
        mesmo número
E       assert (0.7, 0.0) == (1.0, 1000.0)

E       AssertionError: o `rumble.set` ignorou o degrau que o poll loop tinha acabado de
        gravar e recalculou por conta própria: veio (60, 60)
E       assert (60, 60) == (200, 200)

E       AssertionError: `apply_rumble_policy` voltou a consultar `daemon._rumble_engine`
        — o atributo que não é instanciado em `src/` em lugar nenhum

FAILED tests/unit/test_rumble_mult_um_dono.py::test_as_tres_rotas_leem_a_mesma_memoria
FAILED tests/unit/test_rumble_mult_um_dono.py::test_a_rota_do_aplicar_herda_o_que_o_poll_loop_gravou
FAILED tests/unit/test_rumble_mult_um_dono.py::test_ninguem_mais_le_o_rumble_engine_na_rota_do_set
3 failed, 9 passed in 0.33s
```

**Com a cura devolvida:**

```
$ .venv/bin/python -m pytest tests/unit/test_rumble_mult_um_dono.py -q
............                                                             [100%]
12 passed in 0.30s
```

`test_passado_o_debounce_o_degrau_troca` é o outro lado da régua: sem ele, o caso
principal passaria também numa "cura" que congelasse o multiplicador para sempre.
`test_a_rota_do_aplicar_herda_o_que_o_poll_loop_gravou` prova o sentido inverso —
a memória é de mão dupla, e medir um sentido só deixaria metade do defeito viva.

### BG-03 — `tests/unit/test_fala_do_mapa.py`

`test_a_virgula_tem_um_dono_so` varre `src/**.py` por **AST**, procurando
`<algo>.replace(".", ",")`.

**Com a cura arrancada** (a cópia devolvida a `plano_de_radio`):

```
$ .venv/bin/python -m pytest tests/unit/test_fala_do_mapa.py -q
E       AssertionError: há cópia da conversão pt-BR fora do dono único
        (`app/fala_do_mapa.py::formata_pt_br`):
E           - integrations/plano_de_radio.py:229
E         Chame `formata_pt_br` em vez de reescrever a conta. Se for uma cópia que você
        NÃO pode curar (arquivo fora da sua posse), declare-a em `_COPIAS_DECLARADAS`
        com o motivo e o relato — nunca em silêncio
FAILED tests/unit/test_fala_do_mapa.py::test_a_virgula_tem_um_dono_so
1 failed, 22 passed in 1.71s
```

**Com a cura devolvida:**

```
$ .venv/bin/python -m pytest tests/unit/test_fala_do_mapa.py -q
.......................                                                  [100%]
23 passed in 1.77s
```

`test_nenhuma_copia_declarada_sobreviveu_a_propria_cura` é o outro lado: o dia em
que a cópia declarada for curada, o registro reprova em vez de apodrecer calado.

## O que NÃO verifiquei

- **Nada com o aparelho na mão.** Não toquei a bancada. O que o motor recebe de
  verdade em cada degrau do "auto", com bateria caindo numa partida real,
  **NÃO foi medido** — o que este trabalho prova é que as três rotas fazem a
  MESMA conta, não que a conta seja a certa.
- **Não rodei a suíte inteira** (regra da casa). Rodei os **707** testes dos arquivos
  que citam `ipc_rumble_policy`, `core/rumble`, `RumbleEngine`, `secao_controles`,
  `plano_de_radio` ou `fala_do_mapa`, mais o portão de lápides inteiro. Todos
  verdes.
- **Não olhei a tela.** Não rodei `retratar_abas.py` (regra R-C), e não
  fotografei nada. O argumento de que **nenhum texto mudou** é de saída de
  função, provado por teste (`test_as_duas_convertidas_devolvem_o_que_o_dono_devolve`
  compara sete valores, inclusive negativos e o `260,45` que arredonda) — **não**
  é uma foto do antes e depois.
- **Não medi o custo de import** do `plano_de_radio` → `app.fala_do_mapa`.
  Argumentei pela estrutura (módulo stdlib-only, `app/__init__.py` é uma
  docstring, importador único), não por cronômetro.
- **`ipc_handlers.py` não é posse desta frente** e não foi tocado. A frase dele
  sobre o `_rumble_engine` já estava certa; o número de linha que a lápide citava
  (`:2237`) estava velho — corrigi a lápide, não o `ipc_handlers`.
- **A observabilidade `rumble_mult_applied`**: o writeback agora alimenta
  `daemon._last_auto_mult`, que é a fonte que `state_full` publica. **Não** rodei
  o daemon vivo para ver o número chegar à aba; `tests/unit/test_ipc_state_full_live.py`
  passa, e é dublê.

## O que sobrou para o próximo

1. **`app/widgets/calibrar_entradas.py::_virgula` (:211) é a QUARTA cópia da
   vírgula** e ficou de pé — o arquivo está **fora da posse da L3-F** (regra
   R-A). Ela está declarada em `_COPIAS_DECLARADAS`, em
   `tests/unit/test_fala_do_mapa.py`, com este relato como endereço. **O
   conserto é de uma linha** (`return formata_pt_br(numero)` + o import), e
   quem o fizer tem de apagar a entrada do registro, senão
   `test_nenhuma_copia_declarada_sobreviveu_a_propria_cura` reprova.

2. **`core/rumble.py::RumbleEngine` está pronta para ser APAGADA.** A pergunta
   que a lápide abriu em 12/08 — *substituído ou nunca ligado?* — foi respondida
   nesta frente: **substituído**. O que segura a classe são três testes fora da
   posse desta frente:
   `tests/unit/test_rumble_policy.py` (blocos `RumbleEngine` e
   `update_auto_state`), `tests/unit/test_led_and_rumble.py::TestRumbleEngine` e
   `tests/unit/test_politica_de_vibracao_a_escada_que_amplifica.py`. Um commit
   só apaga a classe, os três blocos e a lápide.

3. **`app/fala_do_mapa.py::Numero` continua órfão, e a ordem da frente supunha
   que não.** Ele amarra uma constante Python medida a uma célula do mapa e
   valida os quatro campos no `__post_init__`. Quem publica esses números hoje é
   a tupla crua `integrations/radio_da_mesa.NUMEROS_MEDIDOS_NO_MAPA`:153-157,
   com os **mesmos quatro campos** e nenhuma validação. Trocar a tupla por uma
   tupla de `Numero` fecha a lacuna — `radio_da_mesa.py` não é posse desta
   frente. **Atenção:** ele é hoje o canário de
   `test_o_ponto_de_entrada_declarado_e_o_que_abre_o_alcance`; quem o fiar troca
   o canário no mesmo commit.

4. **Fato histórico que envelheceu, em arquivo alheio.** O docstring de
   `scripts/validar-fala-de-tela.py::valida_numeros` diz *"era a QUARTA da
   árvore (as outras três: `app/fala_do_mapa.py:228`,
   `app/actions/config/secao_controles.py:434` e
   `integrations/plano_de_radio.py:214`)"*. A frase é passado declarado e segue
   verdadeira como história, mas os três endereços mudaram e duas das "outras
   três" agora delegam. `scripts/` não é posse desta frente.

5. **Nenhum portão foi acrescentado a `scripts/portoes.sh`** (regra R-D). Os
   testes novos entram pela suíte. Se quem coordena achar que
   `test_fala_do_mapa.py::test_a_virgula_tem_um_dono_so` merece a lista, ele
   entra em `portoes.sh` **e** no `ci.yml` no mesmo commit.

6. **O portão `ruff` já estava VERMELHO quando esta frente começou, e continua.**
   Três `E501` em dois arquivos que esta frente **não tocou** (`git diff HEAD`
   vazio para os dois) — as linhas vieram do commit `c165485c`
   *"fix(acentuação): as sete isenções da poda da fábrica"*, que é a base desta
   branch:

   - `tests/unit/test_match_sem_caixa_e_sentinel_manual.py`:275 (103 > 100)
   - `tests/unit/test_o_preset_nao_escolhe_a_mascara.py`:63 (135 > 100) e :85 (136 > 100)

   As três são o comentário `# noqa: acentuacao — …` empurrando a linha para
   além de 100 colunas; o `ruff` ainda avisa que duas dessas diretivas são
   inválidas para ele (*"expected a comma-separated list of codes"*), porque
   `acentuacao` é regra da casa, não código do ruff. **Não consertei: arquivo
   alheio** (regra R-A). Os outros **18 de 19** portões rápidos estão verdes.

```
  ruff                   VERMELHO rc=1    12 ms
REPROVOU: 1 vermelho(s) de 19 -> ruff
```
