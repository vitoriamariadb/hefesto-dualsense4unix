# BERÇO-DE-TMP-01-exec — a cauda do `$HOME`

Frente 17 (Portão e teste), `SPRINT_ORDER.md` §0.12. Árvore
`/mnt/Apate/Desenvolvimento/hefesto-voo/BERCO-DE-TMP-01-exec`, branch
`voo/BERCO-DE-TMP-01-exec`.

## O que mudou

1. **`tests/conftest.py`** — a fixture autouse `_hefesto_fake_env` passou a
   isolar `HOME` (`monkeypatch.setenv("HOME", str(xdg_root / "home"))`), além
   dos quatro `XDG_*` que já isolava. Sem escotilha própria: os 7 arquivos de
   teste que já faziam `monkeypatch.setenv("HOME", ...)` continuam livres,
   vencem por rodar depois. Comentário explicando o porquê e citando os dois
   sintomas medidos (`i18n.py`, `system_check.py`) adicionado no ponto da
   mudança. Corrigido também um comentário vizinho, sobre
   `HEFESTO_CARONA_WRAPPER`, que dizia "o HOME NÃO é isolado" como causa —
   deixou de ser verdade, e a razão do desligador continuar foi reescrita
   (segunda camada deliberada, não vazamento).
2. **`tests/unit/test_home_tambem_vazava_01_a_cauda_do_berco_de_tmp.py`**
   (novo, 4 casos) — prova a isolação: (a) `$HOME` sob teste difere do
   `$HOME` real do dono do processo (medido via `pwd`, não via `os.environ`,
   para não depender do próprio mecanismo testado); (b) `Path.home()` cai
   exatamente em `tmp_path/.xdg/home`; (c) o alvo que
   `system_check._wireplumber_hijacks_mic()` leria fica dentro do `tmp_path`
   da sessão, e a função retorna `False` por padrão; (d) o segundo candidato
   de `i18n._candidate_locale_dirs()` (o `Path.home()` cru) também fica
   dentro do isolamento.
3. **`tests/unit/test_conftest_canario_fs.py`** — docstring do módulo
   corrigido: dizia que `_hefesto_fake_env` "isola os diretórios XDG, mas NÃO
   isola o HOME"; não é mais verdade, nota de correção datada acrescentada.
4. **`tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py`**
   — docstring da fixture `carona_ligada` corrigido pelo mesmo motivo.
5. **`docs/process/sprints/2026-08-07-BERCO-DE-TMP-01-a-suite-nao-suja-a-config-dela-suja-o-tmp.md`**
   — cabeçalho e item de "O que fica ABERTO" atualizados (item riscado, não
   apagado); seção nova "A cauda do `$HOME`, fechada em 24/08/2026" com a
   medição completa, a cura e a mordida.

## Qual mordida prova

Comentei as duas linhas de isolamento de `HOME` em `tests/conftest.py` e
rodei o arquivo novo:

```
$ pytest -q tests/unit/test_home_tambem_vazava_01_a_cauda_do_berco_de_tmp.py
FAILED ...::test_home_isolado_nao_e_o_home_do_dono_do_processo
FAILED ...::test_home_isolado_vive_dentro_do_tmp_da_sessao
FAILED ...::test_system_check_nunca_alcanca_o_wireplumber_real
  AssertionError: `_wireplumber_hijacks_mic()` leria
  /home/vitoriamaria/.local/state/wireplumber/default-nodes, fora do HOME isolado
FAILED ...::test_i18n_fallback_de_home_fica_dentro_do_isolamento
  AssertionError: o candidato de fallback de i18n é /home/vitoriamaria/.local/share/locale,
  fora do HOME isolado
4 failed in 0.17s
```

As mensagens de reprovação **nomeiam o `$HOME` real da máquina** — prova de
que os dois arquivos de produção alcançariam o disco dela de verdade, sem a
cura. Devolvida a linha:

```
$ pytest -q tests/unit/test_home_tambem_vazava_01_a_cauda_do_berco_de_tmp.py
4 passed in 0.16s
```

## Validação mais ampla (sem rodar a suíte inteira — proibido no protocolo, §5)

`docs/process/COMO-EXECUTAR-UMA-SPRINT.md` §5 proíbe rodar a suíte inteira num
agente executor (nós `uinput` reais, já derrubaram o fullscreen dela uma vez).
Em vez disso, mapeei TODO call-site de `Path.home()`/`os.path.expanduser("~")`
em `src/` (14 arquivos) e rodei, em lotes, cada arquivo de teste que os
exercita, mais os testes de boot do daemon (onde `system_warnings()` é
chamado a cada subida via `_check_system_on_boot`):

```
tests/unit/test_conftest_canario_fs.py + test_berco_de_tmp.py +
  test_faxina_de_testes.py + test_system_check.py + o teste novo   -> 74 passed
5 arquivos de steam-input/HOME explícito                            -> 144 passed
carona_do_wrapper + udev_kernel07 + steam_launch_options_vdf +
  button_glyph + tray                                               -> 185 passed
storm_doctor / allowlist / dropin (8 arquivos)                      -> 150 passed, 2 skipped
proton_pin / camadas_vulkan / sentinela_do_wrapper (12 arquivos)     -> 278 passed, 1 failed (ver abaixo)
22 arquivos de daemon lifecycle/boot                                -> 199 passed
```

Total: mais de 1000 casos, zero regressão atribuível à mudança.

**Um vermelho pré-existente, não desta sprint**:
`portao_a_casa_sabe_e_o_produto_nao_faz.py::TestTodaPromessaPublicaTemCaminho::test_toda_promessa_solta_esta_classificada`
acusa `app/ipc_bridge.py::machine_declare` e `utils/maquina.py::gravar_maquina`
sem chamador em produção. Confirmado com `git stash` sobre
`tests/conftest.py`: reproduz **idêntico** sem a minha mudança — é resíduo de
outra frente em voo (parece o T-07 do `ONDA0-Z7`, "o `maquina.json` sobrevive
a fechar o programa"), fora da minha posse. Não toquei.

Portões rodados (todos sobre `tests/conftest.py` +
`tests/unit/test_home_tambem_vazava_01_a_cauda_do_berco_de_tmp.py` +
`tests/unit/test_conftest_canario_fs.py` +
`tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py`,
mais os `--all` sobre a árvore inteira onde aplicável):

| comando | resultado |
|---|---|
| `ruff check src/ tests/` | `All checks passed!`, exit 0 |
| `python3 scripts/validar-acentuacao.py --all` | exit 0, sem saída |
| `python3 scripts/validar-glifos.py --all` | exit 0, sem saída |
| `python3 scripts/validar-referencias-docs.py --all` | exit **1**, 4 referências mortas — TODAS em `2026-08-24-ONDA0-Z6-...md` e `2026-08-24-PAREAMENTO-01-...md`, arquivos que não toquei; pré-existente na árvore-base desta leva |
| `bash scripts/check_anonymity.sh` | `OK: anonimato preservado.`, exit 0 |
| `bash scripts/check_test_data.sh` | `OK: dados de teste neutros.`, exit 0 |
| `mypy tests/conftest.py tests/unit/test_home_tambem_vazava_01_a_cauda_do_berco_de_tmp.py` | 6 erros, todos pré-existentes (confirmado por `git stash` — mesmas 6 linhas, só deslocadas) e fora do escopo do CLAUDE.md (`mypy src/hefesto_dualsense4unix` é o alvo do portão, não `tests/`) |

Não rodei `scripts/check_version_consistency.py` nem
`scripts/check_packaging_parity.sh` — nenhum arquivo que eles cobrem foi
tocado por esta leva.

## O que NÃO verifiquei

- **Não rodei a suíte de `tests/core/` nem `tests/fixtures/`** além do que já
  é exercitado pelos arquivos de `tests/unit/` listados acima — só existem
  esses dois outros diretórios em `tests/`, e não os toquei diretamente.
- **Não medi o efeito em produção** de nenhuma forma — a mudança é
  inteiramente em `tests/conftest.py` e arquivos de teste; nenhum arquivo de
  `src/` foi tocado, então o comportamento fora de teste não muda.
- **Não confirmei se `HEFESTO_CARONA_WRAPPER` poderia agora ficar ligado por
  padrão** (já que o `HOME` isolado tornaria `discover_vdfs()` inofensivo por
  default). Decidi deliberadamente NÃO propor essa mudança — é uma decisão de
  comportamento de suíte maior, fora do escopo desta cauda, e falo dela só
  como nota no documento da sprint.
- **NÃO VERIFIQUEI** se existem outros `Path.home()`/`expanduser("~")` em
  `scripts/*.py` ou nos `.sh` que a suíte invoca via `subprocess` — mapeei só
  `src/hefesto_dualsense4unix/`. Se algum script sob teste depender do `$HOME`
  real para algo além do que os lotes acima já exercitaram, pode haver
  superfície não coberta.

## O que sobrou para o próximo

- **Item já registrado como aberto na sprint mãe, ainda aberto**: os 17
  teclados uinput com nome de produção, o elo causal do `launch_env`, os 3
  `.lock` órfãos (decisão dela), `/tmp/pytest-of-vitoriamaria` (1,3 GB, a
  faxina só relata), o canário sem ver leitura, e rodar a faxina com
  `--apagar` (dela). Nenhum destes é tocado por esta cauda.
- **Dívida técnica comum, não "dela"**: se algum dia alguém quiser reabilitar
  `HEFESTO_CARONA_WRAPPER` por padrão nos testes (agora que o `HOME` isolado
  torna isso seguro), é uma decisão de escopo maior — citada como nota, não
  proposta.
- **A referência morta em `validar-referencias-docs.py`** (`../../../CLAUDE.md`
  em dois sprints de 24/08 que não são meus) fica para quem tem posse
  daqueles arquivos.
