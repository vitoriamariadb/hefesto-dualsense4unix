# LUZ-CEGA-01 · E8 — o berço que vazava, e o portão sem chamador

Agente A7, 25/08/2026, madrugada. Árvore `hefesto-voo/LUZ-CEGA-A7`,
branch `voo/LUZ-CEGA-A7`.

## O que mudou

### 1. A DATA DA ESCRITA, medida no journal dela

O sprint dizia *"quem escreveu ainda é desconhecido"*. O journal dela responde
**quando**, e o quando estreita o quem a uma janela de dez horas.
`identity_fila_restaurada` publica a fila inteira a cada arranque do daemon;
filtrada por transição, ela é a linha do tempo do arquivo:

| momento | a fila gravada, como o daemon a leu |
|---|---|
| 2026-08-10T15:38 | `a0fa9c…f0:1, 143a9a…ab:2, aabbcc000001:3, aabbcc000002:4` |
| 2026-08-11T23:50 | `444648…03:1, 143a9a…ab:2, a0fa9c…f0:3, d42f4b…d8:4` — **limpa** |
| 2026-08-16 → 08-18 | quatro DualSense reais, sem fixture |
| **2026-08-22T02:13:43** | **`aabbcc000002:1, aabbcc000001:2, aabbcc000003:3, aabbcc000004:4`** |
| 2026-08-22T02:57 em diante | os forjados na frente, os reais empurrados para 6, 7 e 8 |

A linha de 02:13:43 vem acompanhada de
`identity_slots_restaurados_de_outro_boot arquivo_boot=df8018bc…`. Três coisas
saem daí, e as três são medidas:

1. **a escrita aconteceu dentro do boot `df8018bc`** — 21/08 15:56 → 22/08
   01:55. O daemon de 02:13 apenas LEU o que já estava lá;
2. **quem escreveu apagou a fila dela** — o arquivo ficou com os quatro
   forjados e MAIS NADA. Um `_save_locked` do `ControllerIdentityRegistry`
   substitui as entradas `kind=dualsense` inteiras e preserva só as do outro
   registro, então o registro que gravou tinha **exatamente** os quatro
   forjados e nenhum dos dela;
3. **quem escreveu resolveu o `config_dir()` VERDADEIRO e leu o `boot_id`
   VERDADEIRO** — o `boot_id` no arquivo era o do boot vivo, não um dublê.

O par `aabbcc000001`/`aabbcc000002` é **anterior ao journal** (já estava lá em
10/08, e o journal desta máquina começa em 10/08 15:30). São dois eventos
distintos, não um.

### 2. A REPRODUÇÃO CONTROLADA do mecanismo

O artefato dela é reproduzível em quatro linhas, e sai **idêntico em forma**:

```python
monkeypatch.setenv("XDG_CONFIG_HOME", str(isolado))
reg = ControllerIdentityRegistry()
reg.sync_connected(["aa:bb:cc:00:00:02", "aa:bb:cc:00:00:01",
                    "aa:bb:cc:00:00:03", "aa:bb:cc:00:00:04"])
monkeypatch.undo()          # o isolamento SAI — é o teardown de todo teste
reg.compact({...})          # o gesto "Renumerar agora" força o save
```

Saída, no `config_dir()` REAL do processo:

```json
{"version": 3, "boot_id": "d5816c58-…", "order": [
  {"addr": "aabbcc000002", "kind": "dualsense", "rank": 1},
  {"addr": "aabbcc000001", "kind": "dualsense", "rank": 2}, …]}
```

Compare com o dela: `aabbcc000002:1, aabbcc000001:2`. Mesma forma, mesma ordem,
`boot_id` real. **A CLASSE está provada**: um registro populado sob isolamento
que grava DEPOIS que o isolamento saiu produz exatamente o arquivo dela.

O arquivo de reprodução **não ficou na árvore**: ele escreve no `config_dir()`
de quem o roda, que é o defeito que se mede. Está preservado no scratchpad
desta sessão (`reproducao-do-vazamento.py`) e a receita está acima, inteira.

### 3. O escritor de UMA das rotas, com arquivo:linha

`src/hefesto_dualsense4unix/app/gui_prefs.py:21` (antes da cura):

```python
_CONFIG_DIR = xdg_paths.config_dir()
_PREFS_FILE = _CONFIG_DIR / "gui_preferences.json"
```

Constante de módulo, avaliada na IMPORTAÇÃO — que na suíte acontece na
**COLETA**, antes de qualquer fixture. O isolamento de `XDG_CONFIG_HOME` do
`tests/conftest.py` é de escopo de FUNÇÃO e **não a alcança nunca**: todo
`save_gui_prefs` sob teste escrevia em
`~/.config/hefesto-dualsense4unix/gui_preferences.json` da máquina de quem
rodasse.

Isto **não é hipótese**: é a terceira constante da mesma família que o
CANARIO-FS-01 nomeia no próprio texto de reprovação, e que 05/08/2026 curou em
duas (`storm_doctor._allowlist_path`, `EmulationActionsMixin._wp_dropin_dir`).
Esta passou. O `tests/unit/test_config_a_janela_na_tela.py:21` já a
**documentava como perigo vivo** em 22/08 — *"Um `set_pref` real neste arquivo
editaria as preferências DELA"* — e ninguém a curou; o teste contornou.

**Curada:** o caminho virou `_prefs_file()`, resolvido na chamada. Em produção
nada muda (`config_dir()` já relê `XDG_CONFIG_HOME` a cada chamada).

### 4. Por que NINGUÉM viu, que é o defeito maior

O CANARIO-FS-01 deveria ter pego a escrita de 21/08 e não pegou. Duas razões,
as duas estruturais:

1. **ele é delta de CONTEÚDO, e a mesa dela já nasce suja.** De 22/08 em diante
   toda sessão COMEÇA com a poluição no lugar: foto inicial e final concordam,
   e o canário fica calado para sempre sobre um defeito que continua no disco;
2. **ele é rotineiramente DESLIGADO justamente onde importa.** Com o daemon e a
   janela dela vivos ao lado, ele acusa a escrita do PRODUTO como se fosse da
   suíte (medido em 06/08: seis escritas em `profiles/` num run que só rodou
   `test_bluez_config_sh.py`), e a própria mensagem dele oferece
   `HEFESTO_SEM_CANARIO_FS=1`.

Daí a **FAIXA-NO-BERCO-01** (`tests/conftest.py`): a segunda régua, com
escotilha PRÓPRIA — herdar o interruptor do canário seria herdar o buraco. Ela
não pergunta *"mudou?"*, pergunta *"apareceu endereço de FIXTURE que não estava
aqui quando a sessão começou?"*. A daemon dela escrevendo os MACs REAIS dela
nunca a dispara, então ela pode ficar ligada na máquina em que o canário fica
desligado. É a regra da casa: duas réguas independentes é o que revela.

**O que ela não pega, escrito para ninguém confiar demais:** um vazamento que
reescreva EXATAMENTE os mesmos endereços nos mesmos arquivos já sujos passa em
branco. Esse é do canário. Nenhuma substitui a outra.

### 5. O portão ganhou chamador

`scripts/check_faixa_sintetica.py` nasceu em 24/08 e **não tinha chamador
nenhum** — nem CI, nem gancho, nem lista de fim de leva. Agora tem três, e cada
contexto varre uma coisa diferente, com razão escrita no cabeçalho do script:

| chamador | o que varre | por quê |
|---|---|---|
| `--arvore` (default) no CI | a **árvore versionada**, atrás de artefato de tempo de execução commitado (`controllers.json`, `maquina.json`, `gui_preferences.json`, …) fora de `tests/` e `docs/` | determinístico, não depende de `$HOME`, verde hoje |
| `--casa` | o `config_dir()` REAL | **opt-in, e só**: numa máquina já poluída ele fica vermelho todo dia até alguém limpar, e a decisão sobre o disco é de quem é dono da máquina |
| `enderecos()` na FAIXA-NO-BERCO-01 | o `config_dir()` real, **por delta** | verde na máquina já poluída, vermelho no dia em que um teste polui |

## Qual mordida prova

### Mordida 1 — a constante congelada

**Cura arrancada** (constante de módulo devolvida a `gui_prefs.py`):

```
FAILED …::test_nenhum_modulo_do_produto_congela_caminho_de_home
FAILED …::test_gui_prefs_le_o_config_dir_do_momento
FAILED …::test_gui_prefs_grava_no_config_dir_do_momento
3 failed, 7 passed in 0.59s

E  AssertionError: `gui_prefs` voltou a congelar o caminho
   (['_CONFIG_DIR (linha 23, chama `config_dir()`)']) — este teste PARA aqui
   de propósito: gravar agora escreveria no `~/.config` de quem o roda.
```

**Cura devolvida:**

```
..........                                                       [100%]
10 passed in 0.56s
```

O portão é AST e olha SÓ o nível do módulo — dentro de função é o certo, e não
acusa. Cobre as dez chamadas que resolvem `$HOME` (`config_dir`, `data_dir`,
`state_dir`, `cache_dir`, `runtime_dir`, `profiles_dir`, `launch_env_dir`,
`wireplumber_config_dir`, `Path.home`, `expanduser`), então pega **a próxima**,
não só esta.

### Mordida 2 — a régua do berço, no cenário exato dela

Com o vazamento reproduzido e **o canário DESLIGADO** (que é como se roda a
suíte na máquina dela):

```
rc com o vazamento (canário DESLIGADO): 1

FAIXA-NO-BERCO-01: endereço de FIXTURE apareceu no config_dir REAL durante
esta sessão (4):
  - …/controllers.json::aabbcc000001
  - …/controllers.json::aabbcc000002
  - …/controllers.json::aabbcc000003
  - …/controllers.json::aabbcc000004
```

**Régua arrancada** (`HEFESTO_SEM_FAIXA_SINTETICA=1`), mesmo vazamento, mesmo
disco:

```
rc com a régua ARRANCADA: 0
--- e o vazamento está no disco: ---
{"version": 3, "boot_id": "d5816c58-…", "order": [{"addr": "aabbcc000002", …
```

Verde com o defeito gravado. É a foto do que aconteceu em 21/08.

### Mordida 3 — a régua sabe RECUSAR e sabe ACEITAR

`enderecos()` e `achados_na_arvore()` têm caso de cada lado, incluindo o que
não pode acusar: fixture em `tests/` continua legítima, e diretório inexistente
devolve conjunto vazio em vez de levantar (régua que derruba a sessão quando
não consegue medir é régua que se aprende a desligar).

## O que NÃO verifiquei

- **Quem, com nome e sobrenome, escreveu em 21/08.** Provei a JANELA (dez
  horas), a CLASSE (registro que grava depois do isolamento sair) e uma
  reprodução que produz o arquivo dela em forma idêntica. Não provei o gesto
  humano daquela noite. O journal não guarda quem rodou o quê, e o registro
  não loga o caminho que resolveu.
- **A suíte de unidade continua inocente, e agora com medição minha.**
  Instrumentei `ControllerIdentityRegistry._path` e
  `ExternalIdentityRegistry._path` para gritar em qualquer caminho fora de
  `/tmp` e rodei os **56 arquivos** de `tests/unit` que citam
  `controllers.json`/`identity`/`sync_connected`/`slot_for`, com `$HOME`
  dublê: **1111 passed, ZERO vazamentos**.
- **`scripts/gui-captura/retratar_abas.py --mesa-cheia` está inocente, medido.**
  Rodei com `$HOME` dublê e destino em `/tmp`: nasceu **um** arquivo no lar
  falso, `.cache/gtk-3.0/compose/…`, e nada em `config/`. O fixture dos quatro
  (`state_full_quatro_controles.json`) usa `aabbcc0000d8/…03/…f0/…ab`, que não
  são os quatro do arquivo dela.
- **Se a poluição causou o branco no fio** (a pergunta que F8 deixou aberta).
  Continua não medida; não é o território de E8.
- **Se algum ensaio de `scripts/ensaios/` fala com o daemon vivo dela por IPC
  com endereço forjado.** Não medi — está na lista do que sobrou.
- **A suíte inteira.** Rodei só o meu escopo, por instrução: os 56 arquivos
  acima, o portão novo, e o `test_config_a_janela_na_tela.py`.

## O que sobrou para o próximo

1. **A LINHA DO `CLAUDE.md` NÃO PUDE SER ESCRITA POR MIM.** O `CLAUDE.md` é
   **gitignorado** (`.gitignore:90`) e só existe na árvore DELA — worktree de
   agente não o tem, e a árvore dela é proibida. A linha que falta, no bloco
   *"Antes de fechar qualquer leva"*, ao lado dos outros portões:

   ```bash
   python3 scripts/check_faixa_sintetica.py    # artefato de runtime versionado
   ```

   Quem integra a leva precisa acrescentá-la à mão. **Sem ela, o portão volta a
   ter só dois dos três chamadores** — e a lista do `CLAUDE.md` é justamente a
   que uma pessoa lê.

2. **O singleton `identity._registry` nunca é resetado entre testes.**
   `reset_identity_registry()` existe e é declarado *"APENAS testes — isola
   estado entre casos"* (`identity.py:1348`), e **nenhuma fixture do
   `conftest.py` o chama**. Estado de um caso atravessa para o outro dentro do
   mesmo processo; é a metade que falta da reprodução acima. Não toquei porque
   o `conftest.py` é recurso de bancada e eu já mexi nele para a
   FAIXA-NO-BERCO-01 — uma segunda mudança de comportamento global no mesmo
   arquivo, na mesma leva, é como se inventa vermelho sorteado.

3. **Dois vermelhos que já estavam lá**, achados de carona e fora do meu
   território (`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`):
   `test_toda_promessa_solta_esta_classificada` e
   `test_nenhuma_lapide_sobreviveu_a_propria_cura`, os dois apontando
   `utils/maquina.py::gravar_maquina` — *"a cura chegou e a lápide ficou"*.
   Não são meus e não os toquei.

4. **`scripts/ensaios/*.py` e o socket IPC.** O `conftest` deixa
   `XDG_RUNTIME_DIR` NÃO isolado de propósito (linha comentada na
   `_hefesto_fake_env`), e o isolamento do socket depende de
   `HEFESTO_DUALSENSE4UNIX_FAKE=1` estar de pé. Um caminho que apague essa
   variável fala com o **daemon vivo dela**. Não achei nenhum hoje; a busca
   ficou incompleta.

5. **A limpeza do arquivo dela é DELA.** Ver abaixo — não apaguei nada.

---

## O comando que ELA roda para limpar (não rodei: é o disco dela)

Com o daemon **parado** (senão ele regrava o que estava em memória):

```bash
systemctl --user stop hefesto-dualsense4unix.service

python3 - <<'PY'
import json, pathlib, shutil
p = pathlib.Path.home() / ".config/hefesto-dualsense4unix/controllers.json"
shutil.copy2(p, p.with_suffix(".json.antes-da-limpeza"))
d = json.loads(p.read_text(encoding="utf-8"))
antes = len(d["order"])
d["order"] = [e for e in d["order"] if not str(e["addr"]).lower().startswith("aabbcc")]
for i, e in enumerate(sorted(d["order"], key=lambda e: e["rank"]), start=1):
    e["rank"] = i
p.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{antes} -> {len(d['order'])} entradas; backup em {p.with_suffix('.json.antes-da-limpeza').name}")
PY

systemctl --user start hefesto-dualsense4unix.service
.venv/bin/python scripts/check_faixa_sintetica.py --casa   # tem de sair OK
```

**O que ela ganha:** os quatro DualSense reais voltam aos postos **1 a 4**. Hoje
eles estão em 1, 6, 7 e 8 — e `core/led_control.py:186-201` só tem cor de PS5
para 1..4: **6 = ciano, 7 = laranja, 8 = roxo, ≥9 = BRANCO**. Com a fila limpa,
cada um volta a ter a cor do lugar dele.

O `backup-limpeza-20260811-233704/controllers.json` também tem duas faixas
sintéticas dentro e continuará acusando no `--casa`. É backup do dia 11 e
**não** é a mesa viva: apagar ou manter é decisão dela.
