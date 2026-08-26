# LEVA-3-G — Poda das conveniências que duplicam um caminho vivo

**26/08/2026.** Nasce da BG-06. Posse: `utils/session.py`, `profiles/sanidade.py`,
`integrations/kernel_cmdline.py`, `tui/app.py`, e no portão de lápides os quatro
blocos desses módulos.

## O que mudou

### Seis símbolos podados, e nenhum tinha chamador de produção

| símbolo | por que saiu |
|---|---|
| `utils/session.py::save_mouse_emulation_enabled` | invólucro legado (FEAT-MOUSE-PERSIST-01) que o próprio docstring mandava não usar; a produção chama `save_mouse_emulation` |
| `utils/session.py::load_mouse_emulation_enabled` | irmã de leitura do mesmo invólucro; a produção usa `load_mouse_preference`/`load_mouse_emulation` |
| `utils/session.py::load_keyboard_emulation_enabled` | somava um default PRÓPRIO a uma precedência que já tem dono — o boot lê `load_keyboard_preference` direto (`daemon/lifecycle.py:841-842`) |
| `utils/session.py::load_coop_enabled` | lápide `return True` mantida por uma razão falsa (ver abaixo) |
| `integrations/kernel_cmdline.py::ownership_record` | segunda forma da regra de dono; a viva é o heredoc do passo `3e` do `install.sh` + `_register_cmdline_owner` |
| `tui/app.py::main_async` | "entry point" que nada declarava; zero chamadores em lugar nenhum |

Cada um deixou no lugar onde morava uma **lápide datada** com a medição e com a
decisão que ele guardava — o corpo sai, a decisão medida fica.

### A trava do applet do COSMIC CAIU, e a medição está registrada

Três entradas do portão recusavam podar porque *"o applet do COSMIC e os plugins
de terceiros são os dois lugares onde este portão é cego por desenho"*.
**MEDIDO em 26/08/2026:** o applet é **Rust** — `packaging/cosmic-applet/Cargo.toml`
+ `src/{main,app,ipc}.rs` —, fala com o daemon por **JSON-RPC** no socket, e

```
$ find packaging -name '*.py' | wc -l
0
```

Não existe um único `.py` sob `packaging/`. Ele não importa Python, logo não
importa estes nomes. O `plugin_api` continua ponto cego por desenho, mas é
contrato de **método** (`on_*`), que o portão nem varre, e nenhum dos seis nomes
aparece nele.

### Duas razões que ENSINAVAM ERRADO, substituídas (a ordem pedia, e as duas se
confirmaram na medição)

**(a) `profiles/sanidade.py::verificar_perfis_do_disco`** — a entrada chamava
isto de *"a lacuna mais barata desta lista de fechar — uma chamada"*: o doctor
chamar a função. **É falso, e fechar assim PIORARIA o produto.** O doctor já faz
o trabalho inteiro em `cli/cmd_doctor.py::_linhas_perfis`: `load_all_profiles()`
dentro de `try/except OSError`, depois `sanidade.verificar_perfis` e
`sanidade.linhas_de_relatorio`, com `_print_bloco_perfis` imprimindo o bloco
`== perfis (coerência entre eles) ==`. A conveniência órfã **não tem** o
`except OSError` — fiá-la trocaria a linha *"não deu para ler os perfis: <erro>"*
por um traceback na cara de quem foi pedir diagnóstico justamente porque algo
quebrou. **Reclassificada** de `_SEM_CAMINHO_HOJE` para `_NAO_E_PROMESSA`, com
nota datada no próprio docstring. Não foi podada.

**(b) `integrations/kernel_cmdline.py::plan_cmdline`** — a entrada dizia que
*"enquanto o shell do install for o dono, este módulo é uma segunda
implementação da mesma regra em outra linguagem"*. **Não existe segunda
implementação:** o instalador **importa este próprio módulo** num heredoc Python
(`install.sh`, passo `3e`: `sys.path.insert(0, root/"src")`, depois
`kc.plan_tokens(tokens)` e `kc.forbidden_reintroductions(actions)`), e o
`install.sh` declara a política com todas as letras — *"quem DECIDE é o módulo
puro integrations/kernel_cmdline.py (100% stdlib, testável); aqui só traduzimos
o plano"*. O que sobra é diferença de FORMA: a produção nunca tem o
`/proc/cmdline` cru na mão (lê tokens do JSON do kernelstub ou da linha do GRUB)
e por isso chama `plan_tokens`. **Reclassificada** para `_NAO_E_PROMESSA`, com
nota datada no docstring. Não foi podada — ver o conflito relatado abaixo.

### Uma ordem que a medição derrubou: `save_keyboard_emulation` NÃO pode ser podada

A ordem a listava entre as podáveis. **Ela tem chamador de produção:**
`daemon/lifecycle.py:1482-1485`, dentro de `set_keyboard_emulation`, na borda que
alterna o teclado em runtime e persiste a decisão dela. Ficou de pé. O que mudou
foi o **endereço caduco** na entrada do portão, que dizia `lifecycle.py:1300` —
substituído pelo medido, `1481-1485`.

### Um ponteiro para função que não existe, corrigido

`profiles/schema.py:1304` citava `utils.session.load_keyboard_emulation` — nome
que **nunca existiu** neste módulo. Trocado por `load_keyboard_preference`, que
é quem de fato responde pela flag global. (`session.py:416` tinha o mesmo defeito,
apontando para o invólucro podado; corrigido para a precedência em
`lifecycle.py:839-844`.)

### Um defeito latente achado de raspão, e curado no caminho

Três fixtures que prometem *"neutraliza a escrita em disco das flags de sessão"*
patchavam `save_mouse_emulation_enabled` — o invólucro que a **produção não
chama**. Ou seja: não neutralizavam nada, e um teste dessa família escreveria no
`config_dir` real se o `tmp_path` falhasse. O alvo foi trocado para
`save_mouse_emulation`, que é o que o daemon chama.

## Qual mordida prova

`tests/unit/test_a_poda_nao_come_rota_viva.py` — 14 casos. Varredura por **AST**
sobre `src/`, `tests/`, `scripts/` **e o Python embutido em heredoc** de
`install.sh`/`uninstall.sh`, afirmando, para cada nome de `_PODADOS`, (1) que ele
sumiu de verdade e (2) que ninguém o chama — reprovando com **arquivo e linha**
do chamador. Literal de texto conta como chamador só em produção; em `tests/`
não, porque é lá que se escreve `assert not hasattr(session, "<nome>")` para
TRAVAR a poda, e contar isso proibiria travá-la.

**ARRANCADA 1 — podar quem tem chamador vivo.** Acrescentei
`utils/session.py::save_keyboard_emulation` a `_PODADOS`:

```
E  AssertionError: a poda de `utils/session.py::save_keyboard_emulation` comeu rota
   viva — ela TEM chamador em: src/hefesto_dualsense4unix/daemon/lifecycle.py:1482,
   src/hefesto_dualsense4unix/daemon/lifecycle.py:1485,
   src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py:1,
   src/hefesto_dualsense4unix/utils/session.py:646,
   tests/unit/test_emulacao_no_jogo_teclado.py:65, ...
E  AssertionError: `save_keyboard_emulation` continua definido em utils/session.py:
   a poda ficou pela metade.
FAILED ...::test_todo_simbolo_podado_tinha_zero_chamadores[utils.session.py::save_keyboard_emulation]
FAILED ...::test_todo_simbolo_podado_sumiu_de_verdade[utils.session.py::save_keyboard_emulation]
2 failed, 14 passed in 20.97s
```

É a mesma medição que derrubou a ordem: a régua achou sozinha o chamador que
salvou a função.

**ARRANCADA 2 — cegar a régua ao heredoc do `install.sh`** (removendo o laço de
`_ROTEIROS_DE_PRODUCAO` de `_fontes_python`). Sem essa guarda, a régua daria
verde para qualquer poda em `integrations/` — que é o erro que o portão de
lápides já pagou em 13/08 com `strip_quirks_token`:

```
E  AssertionError: a varredura não achou `plan_tokens` em heredoc nenhum — e o
   install.sh o chama. Régua cega ao heredoc dá verde para poda que come produção.
FAILED ...::test_a_varredura_enxerga_o_python_dentro_do_heredoc
1 failed, 13 passed in 17.94s
```

**CURA DEVOLVIDA:**

```
14 passed in 18.65s
```

Portão de lápides depois da poda: `35 passed in 55.88s`.
Testes tocados: `65 passed` (mouse/teclado/co-op/kernel_cmdline/ipc-mouse) e
`81 passed` (motion/broker/gamepad/sanidade).

## O que NÃO verifiquei

- **Nada rodou na bancada.** Não parei daemon, não toquei `hidraw`, não conectei
  aparelho. A poda é de símbolos sem chamador; o comportamento do teclado, do
  mouse e do co-op no aparelho **não foi observado**.
- **Não rodei `install.sh` nem o ciclo `uninstall→install`.** A afirmação de que
  o instalador só usa `plan_tokens`/`forbidden_reintroductions` (e não
  `ownership_record` nem `plan_cmdline`) vem de LEITURA do heredoc e de grep, não
  de execução. Se houver um segundo heredoc que o meu regex não pegou, a régua da
  mordida também não o pegaria — os dois usam o mesmo padrão.
- **Não rodei a suíte inteira** (regra da casa). Rodei, por caminho, os nove
  arquivos que a poda toca mais o portão de lápides.
- **Não abri a janela nem tirei foto.** A frente não toca `app/` nem `gui/`, e a
  poda não muda nenhuma frase de tela — nenhum texto novo, nenhum PROVISÓRIO.
- **Não conferi o `plugin_api` símbolo a símbolo.** Conferi por grep que nenhum
  dos seis nomes aparece nele; não li os contratos de plugin de terceiros que
  possam existir fora do repositório.
- **Não medi se algum `.desktop`, unit ou empacotamento chama `main_async`.**
  Grep sobre `assets/`, `packaging/`, `flatpak/` e `pyproject.toml` deu zero, mas
  não executei nenhum deles.

## O que sobrou para o próximo

**1. UM CONFLITO NA ORDEM, e eu escolhi o lado conservador — a decisão é de quem
coordena.** A ordem lista `plan_cmdline` **duas vezes, com destinos opostos**: em
*"Pode: … a porta de string crua de `kernel_cmdline` mais `::ownership_record`"*
e em *"**NÃO PODE**, e substitua a razão: (b) `kernel_cmdline::plan_cmdline`"*.
Obedeci o **NÃO PODE** (podar exige certeza; manter não), substituí a razão e a
reclassifiquei. **Se a intenção era podar, é um commit de três linhas:** a função
é `return plan_tokens(parse_cmdline(cmdline), desired_quirk_ids)`, e o único
custo é reescrever as 11 chamadas de `tests/unit/test_kernel_cmdline_merge.py`
para `kc.plan_tokens(kc.parse_cmdline(...))`. Medido: zero chamadores de
produção, exatamente como `ownership_record`.

**2. Toquei NOVE arquivos fora da posse declarada, todos por consequência direta
da poda, e nenhum deles pertence a outra frente das quatro levas** (conferido
contra os quatro `docs/process/sprints/2026-08-26-LEVA-*.md`):
`tests/unit/test_mouse_persist.py`, `test_emulacao_no_jogo_teclado.py`,
`test_coop_optout_migracao.py`, `test_kernel_cmdline_merge.py`,
`test_ipc_mouse_speed_only.py`, `test_motion_wiring.py`,
`test_hidraw_broker_hooks.py`, `test_subsystem_gamepad.py` e
`src/hefesto_dualsense4unix/profiles/schema.py` (este último **pedido pela
ordem**). A posse da sprint não previu que apagar um símbolo obriga a mexer em
quem o chama; a alternativa era entregar cinco linhas.

**3. `ruff` já estava VERMELHO antes de mim, e continua IDÊNTICO** — `ruff check .`
devolve **os mesmos 7 erros** antes e depois da frente (conferido com `git stash`):
três `E501` (`test_match_sem_caixa_e_sentinel_manual.py:275`,
`test_o_preset_nao_escolhe_a_mascara.py:63` e `:85`, todos por `# noqa` de
acentuação empurrando a linha além de 100 colunas), mais `N818` em
`scripts/check_colisao_de_sprints.py:84`, `RUF003`/`RUF001` em
`scripts/check_paridade_transporte.py:385` e `:389`, e `N806` em
`scripts/gerar-frases-de-tela.py:238`. Nenhum é meu e nenhum está na minha posse.
Os outros 18 portões da camada rápida estão verdes.

**E É ELE QUE IMPEDE A COSTURA.** Rodei `scripts/costurar.sh --seco`: **25 dos 26
portões passam** — inclusive `mypy`, `shellcheck`, `acentuacao`, `anonimato` e
`referencias-docs` —, e a costura recusa com *"ERRO: portão vermelho. A costura
não passa por cima de portão."* O único vermelho é o `ruff` herdado. **Não
costurei**, porque destravá-lo é editar dois arquivos de teste que não são meus,
e a regra R-A manda relatar em vez de escrever. **É conserto de um minuto para
quem coordena:** quebrar em duas linhas o `# noqa: acentuacao` de
`tests/unit/test_match_sem_caixa_e_sentinel_manual.py:275` e de
`tests/unit/test_o_preset_nao_escolhe_a_mascara.py:63` e `:85`. A branch
`voo/LEVA-3-G` está pronta, com um commit, árvore limpa.

**4. O `_PODADOS` da mordida é uma lista, e quem podar depois deve ACRESCENTAR
nela.** A régua vale para a próxima poda de graça — é só somar o nome. Se ela
ficar vazia, `test_a_lista_de_podados_nao_e_vazia` reprova, porque régua que mede
lista vazia passa sempre.

**5. Sobrou um item da mesma família que NÃO é meu:** a razão do
`integrations/kernel_cmdline.py::apply_plan` (bloco `_NAO_E_PROMESSA`) continua
dizendo que *"quem de fato escreve a linha de comando do kernel é o instalador,
em shell"* — verdade pela metade pelo mesmo motivo de (b): o instalador **decide**
em Python, importando este módulo, e só **escreve** em shell. A entrada não é
falsa o bastante para eu trocá-la sem pedido, mas ela ensina a mesma meia-verdade.
