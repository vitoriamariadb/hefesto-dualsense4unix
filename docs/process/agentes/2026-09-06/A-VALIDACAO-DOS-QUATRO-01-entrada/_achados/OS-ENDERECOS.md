# OS ENDEREÇOS — o que dois batedores já mediram, para você não remedir

**06/09/2026.** Dois agentes leram a casa antes de você. O que está aqui foi
conferido no disco, com caminho e linha. **Confira antes de acreditar** (um
endereço pode ter andado uma linha), mas não refaça a busca.

---

## 1. O DESENHO DO CONTROLE

**A função de entrada, e é ela que você chama:**

```python
# src/hefesto_dualsense4unix/interface/monta.py:1456
def svg(pref: str, colorway: str, classes: str = "ds-svg",
        acesos: tuple[str, ...] = (), jogador: int | None = None,
        luz: str | None = None, apertados: tuple[str, ...] = (),
        lampadas: bool = True) -> str:
```

* O arquivo-fonte é `src/hefesto_dualsense4unix/interface/ds_limpo.svg`
  (94.712 bytes, 69 ids), lido uma vez em `monta.py:67`.
* **`pref` é o que permite QUATRO na mesma página:** `monta.py:1486-1487`
  prefixa todo id e todo `url(#…)`. Sem ele os ids colidem.
* `lampadas=False` arranca o grupo das cinco lâmpadas (`monta.py:1493`).

**Quatro lado a lado já existe** em quatro abas — `01-jogar`, `04-iluminacao`,
`05-vibracao`, `06-navegacao`, cada uma com 4 `class="ds-svg"`. Os laços:
`aba01.py:1171`, `aba04.py:1370`, `aba05.py:1772`, `aba06.py:2351`. Grades CSS
de quatro colunas prontas em `aba06.py:249`, `aba05.py:410`, `aba04.py:253`.
Funções de desenho por controle para reusar: `aba06.py:1361`, `aba05.py:1513`,
`aba08.py:2109`, `calibrar.py:185`.

### AS 28 PEÇAS, por `id` no SVG

| região | ids |
| --- | --- |
| face | `triangle` `circle` `square` `cross` |
| direcional | `dpad_up` `dpad_right` `dpad_down` `dpad_left` |
| ombros | `l1` `r1` |
| gatilhos | `l2` `r2` |
| analógicos | `stick_l` `stick_r` |
| centro | `share` `options` `touchpad` `ps` |
| áudio | `mic` `alto-falante` |
| luzes | `lightbar` `led-jogador` (+ `led-jogador-1`…`-5`) |
| chassi | `corpo` |
| **invisíveis** | `feat-giroscopio` `feat-acelerometro` `feat-bateria` `feat-rumble-esquerdo` `feat-rumble-direito` |

Dono: `docs/data/pecas-do-dualsense.csv` (28 linhas).
Portão: `scripts/check_pecas_do_dualsense.py` reprova quando desenho, glifo e
nome discordam.

### AS 9 ZONAS DE PLÁSTICO, por `class="z-*"`

`casca` (`casca_esq`/`casca_dir`) · `painel` · `touch` · `gatilhos` · `dpad` ·
`analogicos` · `botoes_face` · `simbolos` — mais `detalhe`, que é arte impressa
e não tem superfície. Canônicas em `scripts/gerar_cores_do_dualsense.py:74-77`.

`lightbar` e `led-jogador` **não são plástico**: são `luz`, e ficam fora da
tinta do casco.

### OS QUATRO MECANISMOS DE ACENDER — três vivos, UM ÓRFÃO

| parâmetro | o que faz | CSS que consome | estado |
| --- | --- | --- | --- |
| `acesos=` | `monta.py:1495` põe `.acesa` nas peças `class="oculta"` | `topo.html:526-528` (`.oculta{opacity:0}` / `.oculta.acesa{opacity:.95}`) | **VIVO**, mas só alcança as CINCO invisíveis |
| `jogador=` | `monta.py:1497-1528` funde `led-on` nas lâmpadas | `mapa.py:752`, `aba04.py:621` | **VIVO** |
| `luz=` | `monta.py:1531` põe `style="--luz:…"` na lightbar | `mapa.py:750` | **VIVO** |
| `apertados=` | `monta.py:1529-1530` põe `class="marcada"` no `<g>` da peça | **NÃO EXISTE** nas dez abas | **ÓRFÃO** |

**O `apertados` é o seu gancho, e ele nunca funcionou.** Ele escreve a classe
certa, no grupo certo, com o id certo e prefixado — e **nenhuma aba jamais o
chamou**, porque não há regra `.marcada` na folha compartilhada. A única regra
`.marcada` do repositório vive em `scripts/gerar-mapa.py:389-390` e vale só para
o `html/specs.html`:

```css
svg g.marcada > .peca { fill: var(--color-accent); }
svg g.marcada > path[stroke] { stroke: var(--color-accent); }
```

**Cuidado com a linha 1529-1530:** ela tem cara de defeito
(`x.replace(f'<g class="marcada" id="{pref}-{a}"', 1)` — um `replace` com dois
argumentos onde o segundo é `1`). **Leia-a no disco antes de usar.** Se estiver
quebrada, consertá-la é parte do trabalho, com teste que morda.

### O REALCE POR PEÇA, já demonstrado

O `mapa-do-controle.html` cruza lista e desenho **em CSS puro, sem uma linha de
script** — `mapa.py:613-633` gera, peça a peça:

```python
regras.append(f'.mapa:has(.item-{i}:hover) {alvo_css}'
              f'{{fill:var(--pink) !important;stroke:var(--pink) !important}}')
```

E `mapa.py:435-444` põe um `<g class="alvo a-{id}">` transparente com a **forma
real** de cada peça. Gerador: `src/hefesto_dualsense4unix/interface/mapa.py`,
entrada `main()` em `:607`, desenho em `:352`.

### A COR DO PLÁSTICO NO DESENHO

* Dono do dado: `docs/data/cores-do-dualsense.csv` — 28 modelos × 9 zonas, 233
  linhas.
* Quem escreve no SVG: `scripts/gerar_cores_do_dualsense.py` (`gerar_style()`
  em `:271`), emitindo `svg[data-colorway="<slug>"] .z-<zona>{fill:var(--z-<zona>)}`.
* Quem dá a cor em Python: `monta.py:400` `cor_da_zona(colorway, zona)` — sem
  tabela, lê a folha do próprio SVG.
* **Trocar de modelo é trocar UM ATRIBUTO**, nunca repintar: `aba08.py:2129`
  usa `data-colorway`. A razão está medida em `aba08.py:2116-2121` — trocar o
  `<svg>` inteiro custou 31 pinturas em 31 tiques e 50 KB por meio segundo.
* **8 dos 28 modelos** pintam com `pattern`/gradiente e não têm hexa; por isso
  existe `monta.py:440` `cor_de_css`, que devolve `""` quando o valor não
  começa com `#`.

---

## 2. QUEM ESTÁ NA MESA, AO VIVO

### A COR NÃO SE LÊ SEM ESCREVER — e por isso a página PERGUNTA AO DAEMON

`src/hefesto_dualsense4unix/integrations/cor_do_plastico.py:17-21`:

> *"O serial de fábrica de 17 caracteres carrega a cor nos caracteres 5 e 6, e
> ele não está em report nenhum de graça: é preciso PEDIR, e pedir é ESCREVER.
> O comando é a família `SET_FEATURE 0x80`, a mesma em que `[1, 1]` RESETA o
> controle e `[12, 1, …]` grava calibração na memória não-volátil. Não há
> desfazer."*

**Você não vai escrever nada.** O daemon já faz essa leitura uma vez por `uniq`,
fora do tique, com cache de sessão sem TTL (`ipc_handlers.py:3717`). A página lê
o resultado dele.

### O CANAL: socket unix + JSON-RPC 2.0, uma mensagem por linha

* caminho do socket: `utils/xdg_paths.py:152` `ipc_socket_path()` →
  `$XDG_RUNTIME_DIR/hefesto-dualsense4unix/`
* cliente pronto: `cli/ipc_client.py:40` (`IpcClient`), `call()` em `:107`
* ponte sem GTK, 36 funções: `app/ipc_bridge.py`
* contrato gerado: `docs/protocol/ipc-unix-socket.md`
* **o método que interessa: `daemon.state_full`** (`ipc_handlers.py:2603`).
  Também há `daemon.status` (`:2218`) e `controller.list` (`:4604`).

### OS CAMPOS POR CONTROLE — é tudo o que a página precisa

Base (`backend_pydualsense.py:5413`): `index` `connected` `transport`
`is_primary` `uniq` `battery_pct` `battery_state`.

Enriquecidos (`ipc_handlers.py:3498`): **`serial`** · **`modelo`** (o nome de
fábrica: Cosmic Red, Starlight Blue…) · **`nome_declarado`** (o que ela
escreveu à mão) · **`player_slot`** · `lightbar_rgb` / `lightbar_on` /
`lightbar_source` / `lightbar_disputada` · `nascimento` · **`inputs`**
(`lx ly rx ry l2_raw r2_raw buttons`, mais `gyro` e `touchpad` quando há) ·
**`audio`** (`fone_plugado mic_externo mic_mudo mic_mudo_desejado`) ·
`speaker` (`volume muted rota`) · `vpad_backend`.

O handler é desenhado para **10-20 Hz**.

### O SLUG DA COR PARA O DESENHO

`interface/mesa_viva.py:208` `_codigo_para_colorway()` abre o CSV das cores e
devolve `{código: (slug, nome)}`; `:232` `CORES = _codigo_para_colorway()`.
É por aí que o `modelo` do daemon vira o `data-colorway` do desenho.

### SEM DAEMON

`cli/cmd_status.py:77` `_fallback_hardware_read()` já existe e imprime
*"daemon offline — mostrando leitura direta do hardware"*. O parser cru é
`core/physical_report_reader.py`, e ele **difere por transporte**:

```
INPUT_REPORT_USB = 0x01   # 64 B, payload em data[1]
INPUT_REPORT_BT  = 0x31   # 78 B, payload em data[2], CRC-32 nos 4 últimos
```

No rádio exige os 78 B exatos, o bit de áudio desligado e **CRC-32 válido**
(seed `0xA1`). Bateria em `BATTERY_STATUS_OFFSET = 52`; jack e mic em `53`.

**Armadilha:** com o daemon rodando os nós hidraw ficam `0600 root:root` e
`os.open` direto colhe `errno 13`. Sem daemon eles estão abertos.

---

## 3. O QUE NÃO EXISTE — para você não procurar

* **Nenhum servidor HTTP que sirva página.** O único `http.server` do
  repositório é o `/metrics` do Prometheus
  (`daemon/subsystems/metrics.py`, desligado por padrão), que devolve 404 para
  tudo que não seja `/metrics`.
* **Nenhum WebSocket**, nenhuma flag `--serve`, nenhum `flask`/`fastapi`/
  `aiohttp`/`uvicorn` nas dependências.
* Não existe `desenho_do_controle.py` (só como planejamento em sprints não
  executadas), nem pasta `_ferramentas`, nem SVG com quatro DualSense num
  arquivo só.
* O vocabulário da casa para acender é `acesos` / `.acesa` / `led-on` /
  `.marcada` / `--luz`. **Não existe `highlight`, `brilhar` nem `pisca`.**

**A doutrina que vale para o seu servidor** — `scripts/gerar-indice-html.py:18`:

> *"um instrumento que só funciona com rede não serve para depurar rádio."*
