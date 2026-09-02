# ONDA B1 — o inventário do motor, e o reuso que aconteceu no arquivo errado

**02/09/2026.** Esta onda não muda uma linha de produção. Ela mede o que o motor
tem, o que a interface nova alcança, e devolve a lista de reuso disponível — o
insumo das outras ondas da rota.

**Todo número aqui vem de um comando, e o comando está ao lado dele.**

---

## O QUE A MEDIÇÃO DERRUBOU — leia isto antes da lista

Três afirmações da casa caíram hoje. Duas estavam no enunciado do próprio
trabalho.

### 1. A régua de reuso esquecia `profiles/` — e é lá que mora metade dele

A tabela da `ROTA-B` e a do `ROTA-DO-HTML-INDICE` contavam só `app/`, `core/`,
`integrations/` e `gui/`. **`profiles/` ficou de fora**, e é o pacote de onde as
abas Perfis e Gatilhos tiram quase tudo. Com ele contado:

| pacote | linhas | a tabela antiga dizia | **medido** | o que o antigo não via |
| --- | --- | --- | --- | --- |
| `a08_conexoes.py` | 1790 | 14 | **11** | — (contava import repetido) |
| `a10_perfis.py` | 932 | **1** | **6** | `profiles.loader`, `.schema`, `.simple_match`, `.slug`, `.steam_app` |
| `a03_gatilhos.py` | 632 | **1** | **3** | `profiles.schema`, `profiles.trigger_presets` |
| `a02_controles.py` | 509 | **1** | **3** | `core.ds_output_report`, `core.sysfs_leds` |
| `a06_navegacao.py` | 673 | **1** | **3** | `core.acoes_de_botao` |
| `a01_jogar.py` | 434 | 2 | **3** | `integrations.ponte_escada` |
| `a04_iluminacao.py` | 273 | **0** | **1** | `core.led_control` |
| `a05_vibracao.py` | 385 | 2 | **2** | — |
| `a09_sistema.py` | 399 | 2 | **2** | — |
| **total nos nove** | 6.027 | **24** | **34** | |

**`a04_iluminacao` não tem zero import do motor — tem um.** **`a10_perfis` não é
uma aba que reescreveu do zero — é a segunda que mais reusa**, e pinta 100% dos
três campos que tem. A correlação "quem mais reusa mais funciona" sobrevive no
topo (a08 e a10, ambas em 100%), mas **não é monótona**: `a03_gatilhos` alcança
três módulos e pinta 1 campo de 25. Reuso não é pintura.

A régua, e ela é a que vale daqui em diante — módulos DISTINTOS do legado,
contando importe tardio (dentro de função) e `profiles/`:

```python
import ast, pathlib
LEG = {"app", "core", "integrations", "gui", "daemon", "cli", "profiles"}
SRC = pathlib.Path("src/hefesto_dualsense4unix")

def modulos(p):
    achados = set()
    for n in ast.walk(ast.parse(p.read_text())):
        if isinstance(n, ast.ImportFrom) and n.module:
            b = n.module.removeprefix("hefesto_dualsense4unix.")
            achados |= {b} | {f"{b}.{x.name}" for x in n.names}
        elif isinstance(n, ast.Import):
            achados |= {x.name.removeprefix("hefesto_dualsense4unix.") for x in n.names}
    reais = {x for x in achados if x.split(".")[0] in LEG and (
        (SRC / x.replace(".", "/")).with_suffix(".py").exists()
        or (SRC / x.replace(".", "/")).is_dir())}
    return {x for x in reais if not any(o != x and o.startswith(x + ".") for o in reais)}

for p in sorted((SRC / "interface/pacotes").glob("a*.py")):
    print(f"{p.name:22s} {len(modulos(p)):2d}   {', '.join(sorted(modulos(p)))}")
```

### 2. `a03_gatilhos` NÃO duplicou `_padroes` nem `_curva` — as duas já chamam o motor

A `ROTA-B` acusa quatro duplicatas na aba Gatilhos. **Três não são.** Lidas no
fonte, em `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py`:

| a `ROTA-B` acusa | o que a função faz de verdade | veredito |
| --- | --- | --- |
| `_padroes(nome)` `:330` | chama `trigger_specs.preset_to_positional_params(spec, {})` | **já reusa** |
| `_curva(chave)` `:361` | chama `trigger_presets.resolve_feedback_preset(chave)` | **já reusa** |
| `_pronto_da_curva(…)` `:96` | compara com `trigger_presets.FEEDBACK_POSITION_PRESETS` | **já reusa** |
| `_desfecho(resposta)` `:315` | normaliza `bool` / `(ok, motivo)` / `(ok, motivo, corpo)` da ponte | **não é a mesma coisa** |

O docstring de `_padroes` diz com todas as letras: *"NÃO SE DIGITA NENHUM
NÚMERO."* A acusação foi feita por nome, não por leitura.

**`_desfecho` não é duplicata de `humanizar_erro_gatilho`.** Uma normaliza a
FORMA da resposta da ponte; a outra traduz o TEXTO da recusa do daemon
(`"end (3) deve ser > start (5)"` → `"Fim (3) precisa ser maior que Início (5)"`).
São dois trabalhos diferentes. **O defeito real é o oposto do acusado:**

```
$ grep -rn "humanizar_erro_gatilho" src/ tests/
src/…/app/actions/triggers_actions.py:53   (a definição)
src/…/app/actions/triggers_actions.py:763  (a GUI estável, o único chamador)
tests/unit/test_triggers_actions.py:1266,1275,1281
```

Zero pacotes. **A frase humanizada existe, foi testada, e a tela nova não a
mostra** — a recusa do daemon chega crua na tela dela. Isto é uma função do
motor NÃO ALCANÇADA, não uma segunda verdade.

### 3. O `COMO-LIGAR-UMA-ABA.md` proibia reusar `app/actions/` — e proibia 63% do que dá

A frase era: *"**Não** tente reusar `app/actions/*.py`: são mixins GTK."*
Medido, em `app/actions/`:

```
def de módulo:  355 (199 públicas)   ← importam sem janela nenhuma
métodos (self): 571 (119 públicos)   ← precisam da Gtk.Window
```

**199 de 318 defs públicas são de módulo — 63%.** E **oito arquivos são PUROS**
— têm função pública de módulo e NENHUM método, de nenhuma espécie:

```
ambiente_na_tela · config/moldura · config/secao_janela · external_controllers
mode_transition · perfis_web · relancar · trigger_specs
```

`external_controllers.py` sozinho tem **25 funções públicas de módulo e zero
métodos**. A proibição em bloco escondia isso. O arquivo foi corrigido nesta
onda: a regra passou a ser a que separa os dois casos.

---

## A REGRA, e ela decide caso a caso, não arquivo a arquivo

> **`def nome(args)` no topo do módulo → REUSA.** Importa sem janela, responde
> *"qual é o valor?"*.
> **`def nome(self, …)` dentro de classe → NÃO ATRAVESSA.** Precisa da
> `Gtk.Window` inteira, responde *"onde ponho na tela?"*.

Os dois lados, no mesmo arquivo, para não restar dúvida —
`app/actions/triggers_actions.py`:

```python
def humanizar_erro_gatilho(motivo, spec=None):     # :53  REUSA
class TriggersActionsMixin(WidgetAccessMixin):     # :78
    def _rebuild_params(self, …):                  #      NÃO ATRAVESSA
```

**A casa já tinha escrito este achado, e ninguém o generalizou.** Em
`src/hefesto_dualsense4unix/interface/sistema_viva.py:113`:

> *"a matriz é a mesma — mas ela vive em `daemon_actions.DaemonActionsMixin`,
> que é método de classe GTK e **não se importa sem a janela inteira**."*

Como se decide em três segundos, sem ler o arquivo:

```bash
grep -c "^def " src/hefesto_dualsense4unix/app/actions/ALVO.py   # os que reusam
grep -c "    def "  src/hefesto_dualsense4unix/app/actions/ALVO.py   # os que não
```

Por arquivo (públicas de módulo × métodos públicos):

| arquivo | linhas | módulo | método | forma |
| --- | --- | --- | --- | --- |
| `external_controllers.py` | 732 | **25** | 0 | puro |
| `home_actions.py` | 3369 | **35** | 1 | quase puro |
| `jogar/painel.py` | 738 | 15 | 3 | quase puro |
| `trigger_specs.py` | 320 | 3 | 0 | puro |
| `mode_transition.py` | 227 | 4 | 0 | puro |
| `relancar.py` | 301 | 6 | 0 | puro |
| `launch_wrapper_dialog.py` | 475 | 4 | 0 | quase puro (7 métodos, nenhum público) |
| `perfis_web.py` | 466 | 1 | 0 | puro |
| `ambiente_na_tela.py` | 116 | 3 | 0 | puro |
| `secao_controles.py` | 1589 | 11 | 10 | misto |
| `profiles_actions.py` | 4580 | 21 | 12 | misto |
| `daemon_actions.py` | 2807 | 17 | 15 | misto |
| `emulation_actions.py` | 2197 | 12 | 14 | misto |
| `triggers_actions.py` | 770 | **1** | 9 | quase só mixin |
| `lightbar_actions.py` | 1594 | 5 | 18 | quase só mixin |
| `rumble_actions.py` | 1288 | 4 | 10 | quase só mixin |
| `footer_actions.py` | 1837 | **0** | 4 | **só mixin** |
| `status_actions.py` | 3171 | 3 | 4 | quase só mixin |
| `controller_card.py` (widget) | 5951 | **26** | 22 | misto |
| `mapa_da_mesa.py` (widget) | 831 | 7 | 11 | misto |
| `gui/ponte_da_tela.py` | 436 | 1 | 6 | quase só mixin |

**`footer_actions.py` é o único que a proibição antiga acertava**: 1.837 linhas,
zero função de módulo.

---

## O ACHADO MAIOR: o reuso ACONTECEU, no arquivo que o produto não carrega

Antes do piloto único, cada aba teve o seu visor — `jogar_vivo.py`,
`controles_vivos.py`, `conexoes_vivas.py`, `sistema_viva.py`, `perfis_vivos.py`,
todos em `src/hefesto_dualsense4unix/interface/`. Eles abrem uma página e morrem
nela. **O piloto de hoje (`hefesto_vivo.py:62`) carrega `pacotes/`, não os
visores.**

E os visores reusam MAIS:

| aba | pacote (o que o produto carrega) | visor (o que ninguém carrega) | módulos que o produto NÃO recebeu |
| --- | --- | --- | --- |
| **09-sistema** | `a09_sistema.py` — **2** | `sistema_viva.py` — **7** | `ambiente_na_tela`, `daemon_actions`, `daemon.service_install`, `integrations.storm_doctor`, `gui.ponte_da_tela` |
| **02-controles** | `a02_controles.py` — **3** | `controles_vivos.py` — **8** | `jogar.painel`, `mode_transition`, `app.audio_saida`, `app.mic_monitor`, `daemon.service_install`, `integrations.audio_control`, `integrations.cor_do_plastico` |
| 01-jogar | `a01_jogar.py` — 3 | `jogar_vivo.py` — 3 | `integrations.cor_do_plastico` |
| 10-perfis | `a10_perfis.py` — 6 | `perfis_vivos.py` — 4 | — (o pacote já superou o visor) |
| 08-conexoes | `a08_conexoes.py` — 11 | `conexoes_vivas.py` — 2 | — (idem) |

**`a09_sistema` é subconjunto estrito do `sistema_viva`**: não alcança um único
módulo que o visor não alcance, e deixa cinco para trás. E é a aba de 20%. As
cinco casam com os oito campos que lhe faltam, um a um — está na lista abaixo.

**A leitura:** a `ROTA-B` chamou isto de *"recriar do zero"*. A medição diz outra
coisa, e ela é pior: **o trabalho foi feito, provado, e não foi transportado
quando o piloto absorveu as abas.** É trabalho perdido, não trabalho não feito.

---

## PERGUNTA 1 — o que cada aba DEVERIA estar chamando e não chama

**Esta é a lista mais valiosa deste documento.** Cada linha foi conferida com
`grep -rl "\bNOME\b" src/hefesto_dualsense4unix/interface/pacotes/` — as 25 que
aparecem abaixo deram `NENHUM`.

### 01-jogar — faltam `pendente`, `pendente-alvo` (e o gesto `mascara` é mudo)

| campo/gesto | o motor já tem | onde | forma |
| --- | --- | --- | --- |
| `pendente`, `pendente-alvo` | `relancar.texto_do_pendente(modo=…, mascara=…)` | `app/actions/relancar.py:119` | módulo |
| idem (o diálogo) | `relancar.precisa_perguntar`, `.frase_da_mudanca`, `.corpo_do_dialogo`, `.toast_da_escolha` | `relancar.py:156,172,197,244` | módulo |
| gesto `mascara` | `home_actions.mascara_viva`, `.mascara_do_aparelho`, `.toast_da_troca_de_mascara`, `.desfecho_da_troca` | `home_actions.py:916,953,1287,1248` | módulo |
| `aviso-selo`/`aviso-texto` | `painel.avisos_do_estado`, `home_actions.texto_do_radio_fragil`, `.vpad_degradation_text`, `.texto_coop_degradado` | `painel.py:655`; `home_actions.py:589,613,476` | módulo |
| `conta` | `painel.texto_da_conta`, `home_actions.controles_na_mesa` | `painel.py:681`; `home_actions.py:1099` | módulo |

`home_actions.py` tem **35 funções públicas de módulo, todas lógica pura, e
`a01_jogar` alcança ZERO.** É o maior bolsão intocado do motor.

### 02-controles — faltam `l3`, `r3`; e os selos de mic/alto-falante são reescritos

| campo/gesto | o motor já tem | onde |
| --- | --- | --- |
| `mic-selo`, gesto `mic-modo` | `controller_card.acao_mic(entry)`, `.frase_do_alvo_do_mic` | `app/widgets/controller_card.py:1982,2191` |
| `alto-estado`, gesto `mudo` | `controller_card.acao_speaker_mudo`, `.acao_speaker_devolucao`, `.saida_muda_do_entry`, `.speaker_do_entry` | `controller_card.py:2045,2084,2111,1936` |
| `l3`/`r3`, o toque | `controller_card.touchpad_do_inputs`, `.gyro_do_inputs`, `.accel_do_inputs` | `controller_card.py:1913,1862,1886` |
| `luz-hex` | `controller_card.cor_do_swatch`, `.accent_do_card`, `.rotulo_lightbar` | `controller_card.py:2222,2211,1145` |
| `bateria` (o texto) | `controller_card.titulo_do_card`, `.dica_do_titulo`, `.texto_degradacao` | `controller_card.py:1049,1080,1194` |
| `mascara` | `home_actions.mascara_viva` | `home_actions.py:916` |

`controller_card.py` tem **26 funções públicas de módulo, lógica pura, e a
interface nova alcança ZERO** — nem uma. São 5.951 linhas de texto de tela já
provado pela GTK.

### 03-gatilhos — faltam 22 campos, e o que falta NÃO é lógica

O pacote já reusa `trigger_specs` e `trigger_presets` (ver a correção 2). O que
falta é **escrever os 22 endereços**, não calcular os valores. A única função do
motor que ele deveria chamar e não chama:

| campo/gesto | o motor já tem | onde |
| --- | --- | --- |
| a frase de recusa | `triggers_actions.humanizar_erro_gatilho(motivo, spec)` | `app/actions/triggers_actions.py:53` |
| os rótulos `aj-nome-*` | `triggers_actions._rotulo_do_param(spec, nome)` — **privada**, precisa virar pública ou ler `spec.params[].label` direto | `triggers_actions.py:45` |

### 04-iluminação — faltam `player-1..4`

| campo/gesto | o motor já tem | onde |
| --- | --- | --- |
| `player-1..4` | `led_control.player_led_pattern(index)`, `.player_bitmask(leds)` | `core/led_control.py:122,83` |
| gesto `cor` (a conversão) | `led_control.hex_to_rgb(hex_str)` | `core/led_control.py:216` — **e ele recusa dizendo** |
| `aceso`, `brilho` | `lightbar_actions.nome_do_desenho`, `.texto_do_desenho_aceso`, `.frase_do_envio`, `.mensagem_de_secao_fora` | `app/actions/lightbar_actions.py:265,303,226,141` |

### 05-vibração — faltam `motor-d`, `motor-d-pct`, `motor-e`, `motor-e-pct`

| campo/gesto | o motor já tem | onde |
| --- | --- | --- |
| `motor-e`/`motor-d` | `controller_card.motores_no_fisico(item)`, `.pedido_de_vibracao_fresco(item)` | `app/widgets/controller_card.py:1511,1554` |
| o texto do estado | `rumble_actions.texto_dos_pedidos_de_vibracao`, `.texto_do_alcance_da_intensidade`, `.texto_do_teto_do_orcamento`, `.texto_de_onde_grava_e_onde_manda` | `app/actions/rumble_actions.py:186,291,370,459` |

As quatro de `rumble_actions` são de MÓDULO num arquivo que é 4-de-módulo para
10-de-mixin. A proibição antiga teria barrado as quatro.

### 06-navegação — pinta os 7 campos; o que falta é texto de gesto

| gesto | o motor já tem | onde |
| --- | --- | --- |
| `guardar-remapeamento`, `acao-do-gesto` | `input_actions.humanize_button`, `.humanize_binding`, `.dehumanize_binding` | `app/actions/input_actions.py:181,186,200` |
| `teclado` | `input_actions.frase_do_teclado_na_tela(osk_disponivel)` | `input_actions.py:265` |
| a recusa do mouse | `mouse_actions.frase_da_recusa_do_mouse(resposta)` | `app/actions/mouse_actions.py:105` |
| avisos de tecla faltando | `input_actions.frase_dos_botoes_sem_tecla`, `.frase_dos_atalhos_fora_da_lista` | `input_actions.py:222,309` |

### 07-lançadores — NÃO TEM PACOTE, e o motor é PURO

**Os dois módulos desta aba são puros: 10 funções de módulo, zero método.** Quem
escrever o `a07_lancadores.py` não precisa inventar nada. <!-- ref-externa: a ausência do arquivo É o assunto deste parágrafo — a 07 é a única das dez sem pacote -->

| o que a aba faz | o motor já tem | onde | forma |
| --- | --- | --- | --- |
| a carona está ligada? | `carona_do_wrapper.ligada()` | `app/actions/carona_do_wrapper.py:232` | módulo |
| despachar / a passada | `.despachar(…)`, `.passada(completa=…)` | `carona_do_wrapper.py:238,275` | módulo |
| o appid do Steam | `launch_wrapper_dialog.extract_steam_appid(wm_class)` | `app/actions/launch_wrapper_dialog.py:77` | módulo |
| perguntar ou não | `.wrapper_dialog_decision(…)` | `launch_wrapper_dialog.py:106` | módulo |
| os dispensados | `.load_dismissed_appids()`, `.add_dismissed_appid(appid)` | `launch_wrapper_dialog.py:184,213` | módulo |
| o banner | `home_actions.wrapper_banner_text(state)` | `home_actions.py:565` | módulo |

### 08-conexões — pinta tudo o que tem; mas deixa 23 funções na mesa

`a08` alcança **uma** função de `external_controllers`: `chave_de_maquina`
(`:707`). O arquivo tem **25 funções públicas, todas de módulo**. As 24
restantes servem `vizinho-nome`, `vizinho-tipo` e o `?` de cada aparelho:

```
friendly_type · brand_of · transport_label · short_button_label · slot_label
button_labels_for · nintendo_bt_warning · modo_deduzido · input_mode
mode_selector_state · mode_guidance · detail_rows · via_do_controle · marca_e_via
cores_do_plastico_items · cores_para_busca · sinonimos_da_busca · dicas_da_busca
dicas_das_cores · nome_oficial_da_cor · declaracoes_do_aparelho
external_slot · slot_of · external_key
```

**`external_key` (`:412`) aparece em `a08_conexoes.py:1200` — mas dentro de um
comentário, não numa chamada.** Foi assim que a régua frouxa (presença de nome)
o contou como alcançado, e a régua por AST o descontou. É o mesmo erro de forma
que produziu o "77%" falso do mapa: *citar não é chamar*.

### 09-sistema — faltam 6, e as CINCO fontes estão no visor irmão

**Todas as cinco já foram provadas em `sistema_viva.py`.** Trocar cópia por
chamada aqui é transporte, não invenção:

| campo | o motor já tem | onde | provado em |
| --- | --- | --- | --- |
| `hefesto-ambiente` | `ambiente_na_tela.descrever_teclado_na_tela`, `.descrever_display_grafico`, `.descrever_steam_encontrada` | `app/actions/ambiente_na_tela.py:52,76,103` | `sistema_viva.py:193` |
| `hefesto-estado` | `daemon.service_install.SERVICE_NORMAL` + a matriz de `sistema_viva._status_do_daemon` | `sistema_viva.py:110` | idem |
| `hefesto-pausa` | `home_actions.texto_da_pausa(state)` | `app/actions/home_actions.py:216` | — |
| `hefesto-troca-de-perfil` | `home_actions.autoswitch_lock_text`, `.texto_do_cadeado_cego` | `home_actions.py:259,310` | — |
| `bateria-impoe`, `bateria-vale-para` | `secao_orcamento.TETO_POR_PERFIL` (já alcançado) + `.orcamento_em_vigor` | `app/actions/config/secao_orcamento.py:301` | `sistema_viva.py:514` |
| gestos `ver-detalhes`, `refazer-consertos`, `refazer-proton` | `integrations.storm_doctor.*`; `daemon_actions.medir_guarda_do_steam_input`, `.medir_prontuario_dos_jogos`, `.format_fix_safe_result`, `.format_proton_lock_result` | `daemon_actions.py:735,807,825,999` | `sistema_viva.py:166,196` |
| `registro-texto` | `daemon_actions.descrever_deteccao_de_janela(state)` | `daemon_actions.py:123` | — |

### 10-perfis — pinta os 3; o motor sobrando é para o EDITOR

| gesto | o motor já tem | onde |
| --- | --- | --- |
| `editor.jogo` (o casamento) | `profiles_actions` — 21 funções de módulo, das quais o pacote alcança 1 | `app/actions/profiles_actions.py` |
| o carimbo do salvar | `profile_writer.carimbo_que_o_save_leva(…)` | `app/actions/profile_writer.py:57` |
| `remover` (a frase) | `profiles_actions.frase_da_remocao_do_perfil_ativo` | `profiles_actions.py:633` |

---

## PERGUNTA 2 — a duplicata que EXISTE, e ela tem TRÊS grafias

A `ROTA-B` procurou no lugar errado. A duplicata real não está na aba Gatilhos —
está na **normalização do endereço do controle**, e ela tem três donos:

| onde | assinatura | o que faz |
| --- | --- | --- |
| **o motor** | `core/sysfs_leds.py:37` `norm_mac(value: str \| None) -> str \| None` | filtra para HEX, minúsculo, `None` se não sobrar nada |
| a interface | `interface/pacotes/__init__.py:272` `_so_hex(chave: str) -> str` | `.replace(":", "").lower()` |
| a interface | `interface/pacotes/a08_conexoes.py:290` `_so_hex(uniq: str) -> str` | `.replace(":","").replace("-","").strip().lower()` |

**As três discordam, e isso foi MEDIDO — não é hipótese:**

```
entrada                          norm_mac     __init__._so_hex          a08._so_hex  IGUAIS?
'D4:2F:4B:00:00:D8'          d42f4b0000d8       'd42f4b0000d8'       'd42f4b0000d8'  sim
'd4-2f-4b-00-00-d8'          d42f4b0000d8  'd4-2f-4b-00-00-d8'       'd42f4b0000d8'  NAO
'  D42F4B0000D8  '           d42f4b0000d8   '  d42f4b0000d8  '       'd42f4b0000d8'  NAO
'usb-0000:00:14.0-3'          b0000001403     'usb-00000014.0-3'   'usb00000014.03'  NAO
''                                   None                   ''                   ''  sim
```

**Três casos de cinco divergem.** O `_so_hex` do `__init__.py` é o que o
despachante usa para casar `pref` com `uniq` (`__init__.py:252`) — um endereço
com hífen não casa, e o clique cai no controle errado ou em nenhum. E `a02` já
chama `norm_mac` (`a02_controles.py:178`), o que prova que a função do motor
atravessa: é `str -> str`, sem uma linha de GTK.

**Quem fecha a B2 substitui as duas por `norm_mac`** — e não invente uma
quarta.

### A segunda duplicata, menor e certa

`a04_iluminacao.py:158` escreve à mão a conversão que o motor tem:

```python
p.led_set(tuple(int(hexa[i:i + 2], 16) for i in (0, 2, 4)), uniq=uniq)
#         ^^^ isto é core/led_control.py:216  hex_to_rgb(hex_str) -> RGB
```

E o arquivo **já importa `core.led_control`** (para `player_slot_color`). A
diferença que importa: `hex_to_rgb` levanta `ValueError` com a razão escrita —
que é a regra da casa "recusar dizendo" — e a linha de cima devolve lixo calado
para um hex de 5 dígitos.

### O que NÃO é duplicata, e não deve ser mexido

`_uniq(o)` aparece em quatro pacotes (`a02:183`, `a03:274`, `a04:129`,
`a05:159`, `a08:894`) com corpos quase idênticos. **Não é duplicata do motor** —
é a leitura de um clique, e o motor não tem clique. Ela é candidata a subir para
`pacotes/__init__.py`, e isso é assunto da B2, não desta lista.

---

## PERGUNTA 3 — o que NÃO atravessa para HTML, e por quê

Medido sobre as 415 defs públicas de `app/actions/` + `app/widgets/` +
`gui/ponte_da_tela.py` (uma função "não atravessa" se o corpo toca
`Gtk.`/`Gdk.`/`GLib.`/`self._get`/`self._toast`/`set_label`):

```
públicas  atravessa (lógica)  não atravessa (desenho)
    415          314 (76%)              101 (24%)
```

Os que quase não atravessam, e a razão é estrutural, não preguiça:

| arquivo | públicas | desenho | por quê |
| --- | --- | --- | --- |
| `lightbar_actions.py` | 23 | **18** | monta `Gtk.ColorButton` e sliders |
| `emulation_actions.py` | 26 | **14** | diálogos de consentimento |
| `daemon_actions.py` | 32 | **13** | `Gtk.MessageDialog` do exame |
| `profiles_actions.py` | 33 | **12** | a `Gtk.ListBox` dos perfis |
| `rumble_actions.py` | 14 | **9** | os dois sliders de motor |
| `footer_actions.py` | 4 | **3** | o rodapé é widget |

**A régua erra para MENOS nos widgets**: `controller_card.py` sai com 0 desenho
porque as suas 26 públicas são mesmo funções de texto — o desenho está nos
métodos privados. Isso é a favor do reuso, não contra.

**A fronteira, dita de uma vez:** o que devolve `str`, `bool`, `int`, `tuple` ou
`dict` atravessa. O que devolve ou recebe um `Gtk.Widget` não atravessa, e
tentar é o erro oposto ao de reescrever.

---

## PERGUNTA 4 — a linha de base que as outras ondas têm de fazer subir

```
$ (a régua do topo deste documento, em 02/09/2026, na ponta de dev 2b219284)
a01_jogar.py            3   app.actions.jogar.painel, app.actions.mode_transition, integrations.ponte_escada
a02_controles.py        3   app.actions.config.secao_controles, core.ds_output_report, core.sysfs_leds
a03_gatilhos.py         3   app.actions.trigger_specs, profiles.schema, profiles.trigger_presets
a04_iluminacao.py       1   core.led_control
a05_vibracao.py         2   app.actions.mode_transition, app.telas.vibracao
a06_navegacao.py        3   app.actions.mode_transition, core.acoes_de_botao, integrations.uinput_mouse
a08_conexoes.py        11   …secao_controles, …secao_mesa, external_controllers, mapa_da_mesa,
                            gui.aba_conexoes, censo_do_barramento, exame_da_mesa,
                            gesto_de_reconexao, mesa_de_radio, radio_da_mesa, profiles.schema
a09_sistema.py          2   app.actions.config.secao_orcamento, gui.aba_sistema
a10_perfis.py           6   perfis_web, profiles.loader, .schema, .simple_match, .slug, .steam_app
                       --
                       34   (e a07_lancadores.py não existe)

não-abas:  ponte.py 1 (app.ipc_bridge) · rodape.py 4 · perfil.py 2 · __init__.py 0
```

**O alcance FIRME, medido por AST (nome importado do motor, ou atributo lido de
um módulo do motor importado — esta régua erra para MENOS):**

```
nomes do motor efetivamente usados pelos pacotes: 69 (62 distintos)
módulos do motor tocados:                         29
```

Contra o que existe: **415 defs públicas** em `app/actions/` + `app/widgets/` +
`gui/ponte_da_tela.py`, das quais **314 atravessam**. A interface nova alcança
**cerca de 13 funções** dessas 314.

**A ordem de tamanho: o motor oferece 314 funções que dá para chamar, e a tela
nova chama treze.**

---

## COMO A B2 (e as ondas E, F, G) USAM ISTO

1. **A lista da PERGUNTA 1 é a fila.** Cada linha é uma troca de cópia por
   chamada, ou um campo que nasce chamando em vez de calculando.
2. **A ordem de retorno**, por trabalho perdido recuperável:
   `09-sistema` (5 módulos já provados no visor irmão) → `02-controles` (7) →
   `01-jogar` (`home_actions`, 35 funções intocadas) → `07-lancadores` (motor
   100% puro, pacote inexistente).
3. **A duplicata a matar primeiro** é `_so_hex` × `norm_mac`: três grafias,
   divergência medida em 3 de 5 casos, e uma delas é o casamento de endereço do
   despachante.
4. **A régua do topo é a linha de base.** Quem fechar uma onda cola o antes e o
   depois dela no relatório.

---

## O QUE ESTA ONDA NÃO FEZ, e por quê

- **Não trocou uma linha de produção.** A B1 é inventário; a troca é da B2, e
  partir as duas foi o que tirou a colisão com as ondas E, F e G.
- **Não falou com o daemon vivo.** Há dois controles na mesa dela e treze
  frentes em voo. Todo número aqui é leitura de fonte, não de aparelho.
- **Não mediu o que o `--passear` mede.** O alcance do motor e a pintura do campo
  são coisas diferentes, e a segunda é do relatório do orquestrador.
- **Não tornou pública `triggers_actions._rotulo_do_param`.** É mudança de
  produção, e é decisão da onda dos Gatilhos.
