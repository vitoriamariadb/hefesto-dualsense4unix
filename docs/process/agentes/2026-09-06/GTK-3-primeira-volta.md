# GTK-3 · PRIMEIRA VOLTA — os sessenta e dois testes, um a um

**06/09/2026 · árvore `hefesto-voo/hefesto-voo/GTK-3-D`, branch `voo/GTK-3-D`,
nascida de `onda/atual-0609` e adiantada até `4070cf82` a pedido do
coordenador (era `db5d50a3`; a diferença é uma linha de `mypy` em
`interface/monta.py`, que é `nao_toca` meu).**

> **A decisão dela** (`D-0609-GTK-LEVA-INTEIRA`): *"a ideia sempre foi
> reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro html"*.
> **O motor fica; a janela sai.**

**ESTA VOLTA NÃO REMOVEU UMA LINHA DE `gui/`, do `main.glade`, do `app/app.py`,
do `app/main.py`, do `pyproject.toml`, do `packaging/`, do `install.sh` nem do
`README.md`.** Ela fez os 62 testes, um a um, e mediu o que a segunda volta vai
custar. **A sprint continua `estado: aberta`.**

**O QUE FALTA PARA FECHÁ-LA, em uma linha:** a ONDA E — apagar
`gui/main.glade`, `app/app.py`, `app/main.py` e `scripts/gui-captura/retratar_abas.py`,
com as três pré-condições da §5 no MESMO commit (o portão `palavra-de-tela`, as
721 citações de `docs/`, e o fotógrafo das dez de pé antes do gancho).

---

## 0. O NÚMERO ERA 62, E HOJE SÃO 64 — a aritmética, para ninguém remedir

| medida | conta |
| --- | ---: |
| arquivos de `tests/` que citavam `main.glade` em `f856cbd5` (o `dev` onde a sprint foi escrita) | **62** |
| `tests/unit/test_nada_novo_aponta_para_a_janela.py`, nascido na `GTK-1` (`11423fe1`) | +1 |
| `tests/unit/test_os_leitores_do_glade_tem_dono.py`, nascido na `GTK-2` (`ac0d740c`) | +1 |
| **nesta árvore, antes de eu tocar em nada** | **64** |

Os dois novos são os portões que **querem** o arquivo: um o apaga numa cópia
descartável, o outro cobra que a lista de citações só encolha. Os 62 da sprint
são os outros, e são esses que esta volta atravessou.

**Depois desta volta: 42 arquivos ainda citam `main.glade`, e a citação de
todos eles é PROSA DATADA** — mais os dois portões acima e o
`test_validar_referencias_docs.py`, que escreve um `main.glade` de mentira numa
árvore de mentira. **Nenhum teste desta casa lê o `gui/main.glade` real em
código para medir o produto.** Conferido com `tokenize`, não com `grep`:
comentário e docstring separados de código.

**A conta dos testes, coletada:**

| | testes coletados nos arquivos que citam o glade |
| --- | ---: |
| antes (64 arquivos) | **1.065** |
| depois (51 arquivos) | **879** |
| diferença | **−186** |

O único vermelho dos dois lados é o MESMO e é **herdado**:
`test_as_fotos_acompanham_a_versao.py::test_as_fotos_nao_ficam_atras_do_codigo_da_tela`.
Provado com `git stash`: ele reprova igual com o meu trabalho fora da árvore.
Não é portão (não está no `portoes.sh`), e é do coordenador na suíte do FECHO.

---

## 1. OS 62 VEREDITOS, UM A UM

A regra de classificação é a da sprint, §1: **(a)** mede a JANELA → sai com ela;
**(b)** mede o MOTOR → fica, com o caminho trocado; **(c)** mede a INTERFACE
NOVA e nunca devia ter citado o glade → corrige-se onde está. E o veredito é
sobre a **CITAÇÃO**, não sobre o arquivo — foi por isso que dezessete arquivos
perderam alguns testes e ficaram.

### 1.1 APAGADOS — o arquivo inteiro (13 arquivos · 65 funções de teste)

Todos são (a): **cada teste do arquivo** lê `<object>`/`<property>` do
`main.glade`, monta o `Gtk.Builder` dele, ou mede o `app/app.py` e o
`retratar_abas.py` que saem junto.

| arquivo | testes | a razão, em uma linha |
| --- | ---: | --- |
| `test_glade_signal_handlers.py` | 2 | todo `handler="…"` do XML × o dict literal de `HefestoApp._signal_handlers()`; os DOIS lados morrem |
| `test_glade_vocabulario_leigo.py` | 7 | jargão no texto visível do XML — a contraparte viva é `test_a_palavra_de_tela_da_interface_nova.py`, que varre as dez páginas |
| `test_janela_sem_mentira.py` | 2 | widget invisível que declara sinal, e tooltip que promete desfazer: XML do glade + AST de `app/` |
| `test_janela_cortada_01_o_rodape_nao_sai_pela_borda.py` | 4 | geometria da `Gtk.Window` do glade em sete alturas |
| `test_largura_das_barras_de_vibracao.py` | 2 | largura de `GtkProgressBar` do glade, num builder de verdade |
| `test_largura_a_mesma_em_todas_as_abas.py` | 11 | teto elástico e coluna de valores, medidos no builder do glade em três larguras |
| `test_o_duble_nao_inventa_widget.py` | 2 | todo id que um dublê publica existe no glade — e os dublês são dos testes de GTK |
| `test_p10_a_foto_nao_publica_o_glade_cru.py` | 4 | o fotógrafo `retratar_abas.py` × o XML cru; os dois saem na ONDA E |
| `test_o_campo_do_jogo_na_janela_de_verdade.py` | 11 | `MAIN_GLADE` numa `Gtk.OffscreenWindow`, como na abertura da janela |
| `test_campo_que_nao_nascia_01_o_jogo_da_steam_sem_onde_digitar.py` | 8 | idem: o `no-show-all` do `profile_game_entry_box` do glade |
| `test_lightbar_handler_tem_chamador.py` | 3 | `<signal>` do glade + o dict de sinais de `app/app.py` |
| `test_z4_matriz_widget_deposito.py` | 6 | matriz widget-do-glade → depósito do perfil |
| `test_a_bancada_da_foto_exercita_os_dois_graus.py` | 3 | a bancada de mentira do `retratar_abas.py` |

**O QUE ISSO CUSTA, e está escrito porque custa mesmo:**
`test_campo_que_nao_nascia_01` e `test_o_campo_do_jogo_na_janela_de_verdade`
exercitavam `profiles_actions` (MOTOR) **sobre widgets reais**. A fiação em si
continua medida pelas réguas puras de `profiles_actions`; o que se perde é a
prova de que ela funciona montada. A interface nova não tem equivalente hoje.

### 1.2 APAGADOS — só a(s) função(ões) que mediam a janela; o arquivo FICA (17)

| arquivo | saíram / total | o que saiu |
| --- | ---: | --- |
| `test_fiacao_da_janela_teclado_e_detector.py` | 9 / 28 | os que liam `<object>`/`<property>`; ficam os 19 sobre `emulation_actions` e `daemon_actions` |
| `test_mesa_cheia_11_a_janela_conta_quatro.py` | 10 / 64 | o CENSO dos `translatable="yes"` do glade e a cobertura de inglês dos sete tooltips; ficam 54 sobre `home_actions` e o doctor |
| `test_a_aba_emulacao_nao_promete_transporte_sem_lastro.py` | 6 / 9 | os que liam as páginas do `main_notebook`; ficam as 3 que leem o `mapa-controles.csv` |
| `test_palavra_a_janela_fala_a_lingua.py` | 5 / 9 | os que varriam o texto visível do XML; ficam os 4 sobre `trigger_specs` e estado |
| `test_o_botao_que_tira_o_que_faz_engasgar.py` | 5 / 22 | o botão como `GtkButton`; ficam 17 sobre o módulo e o relatório |
| `test_rumble_por_jogador_01.py` | 4 / 17 | as dicas lidas do XML; ficam 13 sobre o caminho por peça |
| `test_politica_de_vibracao_a_escada_que_amplifica.py` | 3 / 12 (+1 reapontada) | o valor de partida do adjustment, o rótulo do Auto e o widget do aviso — os três são da janela; o Auto saiu da tela nova por decisão dela em 05/09 |
| `test_steam_modo_simples.py` | 3 / 45 | os dois botões e o `<signal>` deles no glade |
| `test_t14_cada_gesto_da_aba_sistema_declara_dono.py` | 3 / 6 | o censo dos gestos dentro do `daemon_box` |
| `test_a_documentacao_conhece_todas_as_abas.py` | 2 / 7 | as duas sobre **as ONZE da janela**; ficam as 5 sobre as DEZ do `monta.ABAS` |
| `test_auto01_um_clique_em_vez_de_dez.py` | 2 / 25 | o co-op que saiu do glade e a "aba Início 100% código" |
| `test_paleta_unica.py` | 1 / 8 | `test_glade_usa_a_paleta`. O `theme.css` **continua medido** — é dele que sai a lista de cores da casa (achado da `GTK-1`) |
| `test_wrapper_banner.py` | 1 / 21 | o `status_wrapper_banner` como widget do XML |
| `test_empate01_a_cor_volta_a_ser_dela.py` | 1 / 22 | `test_o_glade_acompanha`; o par código × tela ficou no `test_teto_da_prioridade_tem_uma_fonte_so`, reapontado (§1.3) |
| `test_lightbar_lexico_sem_leitura.py` | 1 / 7 | o rótulo `player_leds_estado` — **não há equivalente na tela nova**, e isso está na §6 |
| `test_o_rodape_diz_o_que_grava.py` | 1 / 4 | a `tooltip-text` do `btn_footer_apply`; o rodapé das dez é medido por `test_o_rodape_das_dez.py` |
| `test_pagina_de_jogos_diz_onde_se_desfaz_a_excecao.py` | 1 / 3 | o rótulo do `profile_steam_input_check` — **também sem equivalente na tela nova** (§6) |
| `test_t07_a_frase_que_ela_derrubou_nao_volta.py` | 1 / 8 | `test_a_nota_datada_da_decisao_continua_no_glade` — o registro fica no git, que é onde ele sempre esteve |
| `test_a_05_vibracao_diz_a_forca_que_ela_escolheu.py` | 1 / 14 (+1 reapontada) | `test_a_frase_do_auto_nao_volta_a_aba`: a frase dos 5 s só existe na janela |

### 1.3 REAPONTADOS — a pergunta é a mesma, o dono é outro (10)

| teste | de | para |
| --- | --- | --- |
| `test_a_05_vibracao_…::test_as_frases_da_janela_estavel_estao_na_aba` | `<property>` do glade, por âncora regex | **`app/telas/vibracao`** — o dono que a `GTK-2` deu às duas frases (§6.2 do relatório dela) |
| `test_caducos_alcanca_a_tela.py` (3 testes) | um `main.glade` de mentira na árvore falsa, e o real no alcance | **`interface/paginas/09-sistema.html`** de mentira, e **as dez páginas reais** no alcance |
| `test_emulation_mic_quirk.py::_rotulo_do_botao_de_consertar` | `<property name="label">` com "Consertar" | **`interface/paginas/09-sistema.html`**, o `<button data-gesto="refazer-consertos">` |
| `test_teto_da_prioridade_tem_uma_fonte_so.py` (3 testes) | `upper`/`lower` do `profile_priority_adj` | **`10-perfis.html`**, `max`/`min` do `<input type="range" data-hef="editor.prioridade.escolha">` |
| `test_rumble_mult_um_dono.py::test_o_slider_oferece_exatamente_o_que_o_schema_aceita` | `upper` do `rumble_policy_adj` | **`05-vibracao.html`**, `max` do `<input type="range" data-campo="mult-pos">` |
| `test_rumble_actions.py` (2 testes) | idem | idem |
| `test_politica_de_vibracao_…::test_o_teto_do_deslizador_e_o_do_esquema_do_perfil` | idem | idem |
| `test_modo_que_nao_controla_01.py::test_a_descricao_do_desktop_aponta_para_uma_aba_que_existe` | `">Navegação</property>"` no XML | **a BARRA das dez**, `<a class="aba" href="06-navegacao.html">` |
| `test_steam_input_ponteiros.py::_fontes_de_texto_de_interface` | o pacote `.py` **+ o glade** | o pacote `.py` **+ as dez páginas publicadas** |
| `test_uma_faixa_nao_e_um_fabricante.py` | `…/gui/main.glade` como prova de que a raiz deduzida é real | **`pyproject.toml`**, que existe em toda árvore deste repositório |

**Nenhum reapontamento é tautológico.** Os quatro tetos passaram a ler um
literal do HTML publicado (`max="200"`) e a compará-lo com
`RUMBLE_CUSTOM_MULT_MAX` / `sanidade.PRIORIDADE_MAXIMA` — que é exatamente a
forma que a leitura do `upper` do XML tinha. As mordidas da §2 provam isso.

### 1.4 FICAM, intocados — a citação é PROSA DATADA (24)

`portao_a_casa_sabe_e_o_produto_nao_faz.py` · `test_a_09_sistema_sai_do_desenho.py` ·
`test_a_aba_03_gatilhos_fecha_as_linhas.py` · `test_a_aba_05_vibracao_fecha_as_linhas.py` ·
`test_a_aba_10_perfis_fecha_as_linhas.py` · `test_aba_no_jogo_so_com_jogo_aberto.py` ·
`test_as_fotos_acompanham_a_versao.py` · `test_config_01_a_aba_nasce_vazia.py` ·
`test_config_a_janela_na_tela.py` · `test_config_a_palavra_de_tela_da_aba_montada.py` ·
`test_config_selo_de_saude.py` · `test_cor_que_nao_pintava_01.py` ·
`test_gatilho_palavra_rotulos.py` · `test_ligar_que_apagava_a_cura_01.py` ·
`test_mesa_cheia_09_toasts_honestos.py` · `test_o_binding_do_webkit_entra_no_install.py` ·
`test_o_gancho_cobra_a_foto_da_tela.py` · `test_o_rodape_das_dez.py` ·
`test_palavra_de_tela_alcanca_o_python.py` · `test_validar_referencias_docs.py` ·
`test_vocabulario_das_quatro_superficies.py` · `test_z4_o_ciclo_da_janela.py` ·
`test_nada_novo_aponta_para_a_janela.py` · `test_os_leitores_do_glade_tem_dono.py`

A razão é uma só e é regra da casa: **não se apaga decisão medida.** Um
comentário que conta que em 26/08 o rótulo foi renomeado no glade é registro,
não ponteiro. `test_validar_referencias_docs.py` escreve um `main.glade` de
mentira numa árvore de mentira; os dois últimos são os portões da `GTK-1` e da
`GTK-2`, que já sabem se calar (`skipif(not GLADE.exists())`) no dia da ONDA E.

**TRÊS deles têm trabalho de ONDA E e não de agora**, e estão nomeados aqui
para não se perderem:

* `test_o_gancho_cobra_a_foto_da_tela.py:47` — `O_GLADE` é a **entrada** que
  prova que o gancho de `pre-commit` classifica `gui/main.glade` como "tela".
  Reapontá-la hoje mediria um gancho que ainda cobra `gui/`. Muda com o gancho.
* `test_t07_a_frase_que_ela_derrubou_nao_volta.py:84` — o glade está em
  `ARQUIVOS_ISENTOS`, um `Path` numa exclusão de glob `*.py` que nunca casou.
  É cinto; a linha sai com o arquivo.
* `test_as_fotos_acompanham_a_versao.py:108` — declara `gui/` e
  `scripts/gui-captura` como caminhos de tela. É o par do gancho acima.

---

## 2. A MORDIDA — quatro, e as quatro na árvore de verdade

Cada uma: rodei ANTES, arranquei, rodei DEPOIS, devolvi com `git checkout` e
rodei de novo. `git status --short` não trouxe uma linha a mais no fim.

### MORDIDA 1 — o dono novo das frases da vibração (`app/telas/vibracao`)

```
--- ANTES ---  1 passed in 0.25s

--- arranco: "pode impor um teto" -> "pode impor um TETO" em app/telas/vibracao.py ---
163:    "O Perfil de Bateria pode impor um TETO: esta escolha continua valendo, "

--- DEPOIS ---
E  assert 'O Perfil de Bateria pode impor um TETO: …' in '<!doctype html>…'
FAILED …::test_as_frases_da_janela_estavel_estao_na_aba
1 failed in 0.25s

--- devolvida ---  1 passed in 0.24s
```

**É a mordida que a sprint pedia:** o teste reapontado reprova quando o MOTOR
quebra. Ele não passou a medir o próprio texto — mede o dono novo contra a aba
gerada, que é o par que a `GTK-2` construiu.

### MORDIDA 2 — o teto da prioridade na tela (`10-perfis.html`)

```
--- ANTES ---  8 passed in 0.34s
--- arranco: max="200" -> max="100" no trilho da prioridade ---
--- DEPOIS ---
E  +  and   100 = _atributo_do_trilho('max')
FAILED …::TestUmTetoSo::test_a_tela_acompanha_o_verificador
FAILED …::TestUmTetoSo::test_os_tres_lugares_dizem_o_mesmo_numero
2 failed, 6 passed
--- devolvida ---  8 passed
```

### MORDIDA 3 — o alcance do portão de caducos (as dez páginas)

```
--- ANTES ---  6 passed in 0.41s
--- arranco: tiro ".html" de EXTENSOES em scripts/validar-caducos.py ---
--- DEPOIS ---
E  AssertionError: as páginas ['01-jogar.html', … '10-perfis.html'] não estão
   entre os arquivos vivos que o portão varre — um fato caduco escrito nelas
   chegaria à tela dela em silêncio
FAILED …::test_fato_caduco_na_pagina_publicada_reprova
FAILED …::test_as_dez_paginas_reais_estao_no_alcance
2 failed, 4 passed
--- devolvida ---  6 passed
```

### MORDIDA 4 — o `xfail` do microfone se limpa sozinho

```
--- ANTES (defeito vivo) ---   6 passed, 1 xfailed
--- aplico a CURA de uma linha em app/actions/emulation_actions.py:1406 ---
--- DEPOIS ---
[XPASS(strict)] DEFEITO VIVO, medido em 06/09/2026 …  Curou? Apague esta marca.
1 failed, 6 passed
--- devolvido ---  6 passed, 1 xfailed
```

O `strict=True` faz o instrumento se limpar: no dia em que a cura vier, ele
**reprova** até alguém apagar a marca. É o inverso do `skip`, que ficaria calado
para sempre.

---

## 3. O DEFEITO VIVO QUE ESTA VOLTA ACHOU — e nenhuma régua o via

**`app/actions/emulation_actions.py:1406` manda clicar num botão que não está na
tela dela.**

```python
done = (
    "Mic ligado — atenção: sem o ajuste de áudio o controle pode "
    "travar no meio do jogo. Abra a aba Sistema e clique em "
    "“Consertar problemas conhecidos” (vale no próximo boot)."
)
```

Na aba Sistema que ela usa o botão se chama **"Refazer os consertos
automáticos"** (`interface/paginas/09-sistema.html:1379`).

**Por que ninguém viu, e a assinatura é a desta casa:** a régua
(`test_emulation_mic_quirk._rotulo_do_botao_de_consertar`) lia o rótulo do
`gui/main.glade` — *a tela que está saindo*. Ela dava VERDE sobre a frase falsa
porque **respondia sobre outra coisa que não o produto**.

É o defeito de 26/08 pela terceira vez, e o TERCEIRO escritor do mesmo rótulo:

| escritor | estado |
| --- | --- |
| `integrations/storm_doctor.py` | **curado** na costura `2efa6aef`: a página virou a fonte nº 1 de `rotulo_do_botao`, e ele hoje devolve `'Refazer os consertos automáticos'` — medido |
| `tests/unit/test_steam_input_ponteiros.py` | **curado** na mesma costura: passou a ler as dez páginas |
| **`app/actions/emulation_actions.py:1406`** | **VIVO.** Ele não passa por `rotulo_do_botao` — digita a frase inteira |

**Não curei, e a razão é o contrato:** `app/actions/` está no `nao_toca` da
`GTK-3`. **O diff é de uma linha:**

```diff
-        "“Consertar problemas conhecidos” (vale no próximo boot)."
+        "“Refazer os consertos automáticos” (vale no próximo boot)."
```

Aplicá-lo faz `test_mic_on_avisa_quando_quirk_ausente` passar de `xfail` a
`XPASS(strict)` → **reprova**, obrigando a apagar a marca `@pytest.mark.xfail`
que este relatório instalou. Os dois lados vão juntos.

---

## 4. A MEDIDA QUE O COORDENADOR PEDIU — o portão `palavra-de-tela`

**A PREMISSA DO RECADO ESTAVA ERRADA, e a correção é boa notícia.** O recado
dizia: *"apagar o glade não faz esse portão reprovar: faz a guarda medir uma
tela a menos, em silêncio, e continuar verde"*. **Medido, movendo o arquivo de
verdade:**

```
--- COM o glade ---
rc=0

--- SEM o glade ---
/…/src/hefesto_dualsense4unix/gui/main.glade: arquivo de interface não encontrado
1 reprovação(ões) da palavra de tela.
rc=1
```

A guarda é `scripts/validar-palavra-de-tela.py:344` (`conferir()`):
`if not caminho.is_file(): return [f"{caminho}: arquivo de interface não encontrado"]`.
**Ele NÃO se cala: ele para, e nomeia o arquivo.** O `palavra-de-tela` roda na
camada `--rapido` — a ONDA E o encontra vermelho no primeiro `portoes.sh`.

**Mas a PERDA DE ALCANCE é real, e o número é este:**

| | rótulos que o portão lê |
| --- | ---: |
| do `gui/main.glade`, hoje | **219** (212 com texto não vazio) |
| do `gui/main.glade`, sem o arquivo | **0** |
| de `app/**/*.py`, por AST | inalterado (0 reprovações hoje) |

E o portão **não varre `interface/` nem as dez páginas** — o próprio fonte diz
por quê (`:201-204`): *"o texto da interface nova nasce em `interface/abaNN.py`
e, pior, em `<script>` que escreve no DOM em tempo de execução"*, e a régua
daquele lado é `tests/unit/test_a_palavra_de_tela_da_interface_nova.py`, que
varre as dez páginas publicadas com ≥ 11 termos banidos.

**Os outros dois leitores que a `GTK-2` nomeou, conferidos hoje:**

| leitor | estado |
| --- | --- |
| `interface/aba05.py:273` | **MORREU.** A `GTK-2` tirou o `read_text` do XML. Sobram quatro citações, todas prosa datada (`:263, :275, :1761, :1779`) |
| `integrations/storm_doctor.py:69` | **VIVO, mas rebaixado.** A leitura do XML mudou para `:194-195` e virou a fonte **nº 2**: a página publicada passou a ser a nº 1 (costura `2efa6aef`). Medido: `rotulo_do_botao('btn_storm_fix_safe', …)` → `'Refazer os consertos automáticos'`, e o glade não vence mais |

---

## 5. A CONTA DA SEGUNDA VOLTA — medida agora, com os instrumentos da casa

### 5.1 `docs/` — 721 citações mortas em 220 documentos

**Medido movendo os quatro alvos para fora da árvore e rodando o portão**, não
por `grep`:

| alvos removidos | `referencias-docs` |
| --- | --- |
| só `gui/main.glade` | rc=1 · **302 citações · 129 documentos** |
| `main.glade` + `app/app.py` + `app/main.py` + `retratar_abas.py` | rc=1 · **721 citações · 220 documentos** |

**A `GTK-1` estimou 233 documentos por `grep`; o número do PORTÃO é 220 para os
quatro juntos e 129 só para o glade.** Os dois números medem coisas diferentes:
o `grep` conta menção, o portão conta citação entre crases ou como alvo de link.
**O que decide é o do portão.**

**O RECEITUÁRIO ESTÁ PROVADO NESTA VOLTA, em escala pequena.** Apagar 13
arquivos de teste deixou **23 citações mortas em 12 documentos**, e a cura foi o
escape que o próprio portão declara no cabeçalho (`:112`): o marcador de linha
`<!-- ref-externa: motivo -->`. As 23 linhas foram marcadas uma a uma com a
mesma razão datada. **O portão fechou em `OK: 851 documento(s) sem referência
morta.`**

Para as 721 há dois caminhos, e o segundo é o que esta volta recomenda:

1. **marcador linha a linha** — preciso, não cega o portão para um typo futuro
   do mesmo nome, e é o que se fez aqui. **721 linhas.**
2. **declaração de histórico no portão**, no molde do `EXTERNOS` — um lugar só,
   auditável, e some com as 721 de uma vez. **O preço é real:** o portão passa a
   aceitar `gui/main.glade` em qualquer documento novo, para sempre.

### 5.2 Ponto de entrada — UM, e ele já não é a janela

```
[project.scripts]
hefesto-dualsense4unix     = "hefesto_dualsense4unix.cli.app:main"
hefesto-dualsense4unix-gui = "hefesto_dualsense4unix.interface.hefesto_vivo:main"
```

O `-gui` **já abre a interface nova** desde 01/09 (decisão dela, comentário em
`pyproject.toml:100`). **Nenhum entry point aponta para `app/main.py`.** A ONDA E
não mexe em `[project.scripts]`.

O que muda no `pyproject.toml` é **uma linha**: `:112`,
`"src/hefesto_dualsense4unix/gui/*.glade"` no `package-data`. A `:113`
(`gui/assets/*.png`) fica — `gui/assets/` não é a janela.

### 5.3 `install.sh` e `packaging/`

| arquivo | linhas que tocam a janela |
| --- | ---: |
| `install.sh` (4.036 linhas) | **19** |
| `packaging/hefesto-dualsense4unix.desktop` | ver abaixo |
| `packaging/debian/control`, `packaging/debian/prerm` | |
| `packaging/nix/package.nix`, `packaging/arch/PKGBUILD` | |
| `packaging/fedora/hefesto-dualsense4unix.spec` | |
| **`packaging/` inteiro** | **9 linhas em 6 arquivos** |
| `README.md` | **0** |

**O `.desktop` é o lançador DELA e ele já aponta para a interface nova.** A ONDA
E não pode tocá-lo a não ser para tirar referência a arquivo que sumiu — o
`e0bb5b79` o devolveu hoje de manhã e ele não volta a quebrar.

### 5.4 AS TRÊS PRÉ-CONDIÇÕES DA ONDA E — no MESMO commit que apaga

1. **`scripts/validar-palavra-de-tela.py`** — tirar `conferir(GLADE)` de `main()`
   (`:876`) e a constante `GLADE` (`:132`). Sem isso o portão reprova no
   primeiro `portoes.sh --rapido`. **E declarar no relatório os 219 rótulos que
   saem do alcance** — o portão fica medindo só `app/**/*.py`, e quem vigia as
   dez páginas é `test_a_palavra_de_tela_da_interface_nova.py`.
2. **As 721 citações de `docs/`** — pelo caminho 1 ou 2 da §5.1, **no mesmo
   commit**. Um commit que apague o glade sem isso deixa o `referencias-docs`
   vermelho para a leva inteira.
3. **O fotógrafo das dez de pé ANTES do gancho.** `scripts/check_fotos_da_tela.py`
   bloqueia commit que toque `app/`, `gui/` ou `scripts/gui-captura` sem levar
   foto. Se `retratar_abas.py` sair, quem tira a foto das dez tem de existir
   primeiro — senão a próxima pessoa fica com um gancho que cobra uma foto que
   nada mais tira. É o que a sprint §3 Passo 2 já mandava, e continua valendo.

### 5.5 O que o coordenador deve esperar do `install.sh`, no FECHO

**Eu NÃO o rodei** — nem `--yes`, nem dry-run. O que ele deve ver, na árvore
dela, depois da ONDA E: `rc=0`; `doctor` sem nenhuma FALHA; o `.desktop`
abrindo as **dez abas** da interface nova; e nenhum arquivo instalado sob
`gui/` além de `gui/assets/`.

---

## 6. O QUE PERDEU DONO E NÃO ACHOU OUTRO — três, e são trabalho de alguém

Três rótulos que a janela tinha e a interface nova **não tem**. As réguas que os
mediam saíram (§1.2), e nada os cobre hoje:

| o quê | onde morava | quem precisa |
| --- | --- | --- |
| `player_leds_estado` — o texto de espera do desenho aceso, que não pode afirmar estado da barra sem canal de leitura | glade, aba Luzes | a aba 04 da interface nova |
| `profile_steam_input_check` — o rótulo da caixinha do desfazer, que a página `docs/usage/jogos-e-mascaras.md` cita pelo nome | glade, aba Perfis | a aba 10 |
| `btn_footer_apply` — a `tooltip-text` do "Aplicar" do rodapé, que promete gravar a aba Configurações | glade, rodapé | o rodapé das dez (`topo.html`) |

E o valor de partida do trilho da Intensidade
(`test_o_deslizador_nasce_num_degrau_que_existe`, apagado): a página publicada
traz um `value` **por controle**, vindo da bancada viva — não há "degrau de
partida" único a medir. Se a decisão for que existe, a régua volta.

---

## 7. OS 44 PORTÕES

```
TODOS VERDES — 44 portões.
```

`bash scripts/portoes.sh` depois de `git add -A`, na árvore em `4070cf82`.
Saída completa em `<scratchpad>/portoes-2.txt`.

**A PRIMEIRA RODADA TEVE DOIS VERMELHOS, e os dois eram meus:**

| portão | o que era | a cura |
| --- | --- | --- |
| `referencias-docs` | 23 citações mortas em 12 documentos — os 13 arquivos de teste que apaguei | as 23 linhas ganharam `<!-- ref-externa: … -->` com a razão datada. **É o ensaio da §5.1** |
| `acentuacao` | `test_caducos_alcanca_a_tela.py:53:paginas` — o `# noqa-acento` estava na linha errada de uma tupla de várias linhas | a tupla foi quebrada e o marcador foi para a linha da palavra |

**O portão da `GTK-1` aceitou o encolhimento**, que é o sentido que ele existe
para permitir:

```
OK: 231 pares (arquivo, alvo) · 468 citações à janela, todas declaradas com veredito.
     (a lista encolheu: 26 par(es) sumiram e 14 tiveram menos ocorrências.
      Rode `--podar` para o CSV acompanhar.)
```

Eram **255 pares · 522 citações**. **NÃO rodei `--podar`** — o CSV é do
coordenador, e a `GTK-1` deixou isso escrito. O `--podar` só encolhe.

---

## 8. O QUE NÃO VERIFIQUEI

* **Não abri a tela e não há foto.** Nenhuma frase de tela mudou nesta volta:
  todo o trabalho foi em `tests/` e em marcadores de comentário em `docs/`. As
  quatro páginas que as réguas passaram a LER não foram tocadas — provado pelo
  `git status` limpo em `src/hefesto_dualsense4unix/interface/` depois das
  mordidas. Não inventei uma foto.
* **Não rodei a suíte inteira** (regra da casa: é do coordenador, no FECHO, em
  doze lotes). Rodei os **879 testes** dos 51 arquivos que sobraram do meu
  escopo, mais os 44 portões.
* **Não rodei o `install.sh`**, nem `--yes`, nem dry-run. §5.5 diz o que esperar.
* **Não toquei na bancada** — `scripts/bancada.sh exigir` não foi preciso: nada
  aqui escreve no aparelho, para serviço ou chama `systemctl`.
* **Não rodei `--podar`** no CSV do inventário (§7).
* **Não medi o que a remoção faz aos testes que importam `app.app`/`app.main` e
  NÃO citam o glade.** Fora do escopo desta volta (os 62 são os que citam o
  glade). O CSV da `GTK-1` tem 23 pares para `app/app.py` e 6 para `app/main.py`
  em `tests/`, e a ONDA E vai encontrá-los.
* **Não curei o defeito da §3** — `app/actions/` é `nao_toca`. O diff está lá,
  e o `xfail(strict)` obriga quem o aplicar a fechar o par.
* **O vermelho herdado do
  `test_as_fotos_acompanham_a_versao.py::test_as_fotos_nao_ficam_atras_do_codigo_da_tela`
  eu confirmei que é herdado, mas não o curei** — as fotos da documentação estão
  atrás do código da tela, e refotografar carrega o estado VIVO da máquina de
  quem tira (o próprio teste diz isso). É ato dela ou do coordenador na máquina
  dela, não meu numa worktree.

---

## 9. RECADOS PARA QUEM COSTURA

1. **A ONDA D e a ONDA E têm de chegar juntas ao `dev`.** Esta volta apagou 186
   testes da janela e a janela ainda está lá. Se só esta volta entrar, a casa
   passa a enviar uma `Gtk.Window` **sem régua nenhuma sobre os widgets dela**.
   O que ficou de fora está nominado na §1.1 e na §1.2.
2. **O par do microfone (§3) é de UMA linha e não é meu.** Quem tiver
   `app/actions/` na posse aplica os dois lados: o diff e a remoção do
   `@pytest.mark.xfail`.
3. **`--podar` no CSV é seu** (§7): 26 pares e 14 contagens a menos.
4. **A conta de `docs/` é 721 em 220, não 233** (§5.1), e o receituário está
   provado em escala pequena nesta volta.
5. **O `palavra-de-tela` REPROVA quando o glade sai** (§4) — não fica verde. É
   uma correção da premissa do despacho, e ela facilita a ONDA E.
