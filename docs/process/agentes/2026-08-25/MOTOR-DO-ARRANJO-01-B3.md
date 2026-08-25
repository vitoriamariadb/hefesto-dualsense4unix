# MOTOR-DO-ARRANJO-01 — B3 — o motor sai do mockup e vira Python

**25/08/2026, madrugada.** Árvore `hefesto-voo/MOTOR-DO-ARRANJO-B3`, branch
`voo/MOTOR-DO-ARRANJO-B3`. Escopo: **só o motor puro** (MOTOR-1 a MOTOR-4).
MOTOR-5, MOTOR-6 e MOTOR-7 **não foram feitas**, por ordem de quem coordena.

## O que mudou

Seis arquivos novos, nenhum existente tocado.

| arquivo | o que é |
|---|---|
| `src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py` | o motor. Sem GTK, IPC, `/dev`, `/sys`, `subprocess` ou rede |
| `tests/fixtures/motor_do_arranjo_do_mockup.js` | o **oráculo**: extrai o motor do HTML e roda 120 cenários em `node` |
| `tests/fixtures/motor_do_arranjo_do_mockup.json` | o ouro que o oráculo produziu |
| `tests/unit/mesa_do_mockup.py` | a mesa dela, transcrita do mockup (não é teste, não é coletado) |
| `tests/unit/test_arranjo_da_mesa_bate_com_o_mockup.py` | a equivalência, cenário a cenário |
| `tests/unit/test_arranjo_invariantes.py` | as invariantes e a mordida de cada regra |

**Antes de portar, a fumaça:** `node .../fumaca.js` → `29/29 estados pintaram —
nenhum erro de execução`. Verde antes de tocar em qualquer coisa.

### As funções portadas, e a prova de equivalência de cada uma

O oráculo **não copia** o motor: lê `mapa-das-portas.html`, corta do
`(function () {` até a linha do `document.addEventListener("click"`, injeta um
bloco de export e roda. Copiar seria a segunda verdade que esta leva existe para
matar.

| função Python | função do mockup | cenários que batem |
|---|---|---|
| `alocacao(mapa, leitura)` | `alocacaoDerivada` | leitura de 20h15 e de 22h50, mapa vazio, mapa com entrada inexistente |
| `regiao_do_caminho` + `caminho_do_hub` | `regiaoDoCaminho` | 9 caminhos, incluindo o dual-bus `4-1.1.2` e o hub ausente |
| `sem_entrada` | `semEntrada` | duas leituras — bate os 4 de 16 medidos na §7.2 da sprint |
| `candidatas` / `todas_as_entradas` | `candidatas` / `todasPortas` | `pc` → `[2,3,7,8]`, `hub` → `[10,12,14,15]`, 16 entradas |
| `nota_de` + `REGRAS` + `_bonus_separacao` | `notaDe` / `REGRAS` / `bonusSeparacao` | exercitadas por dentro de `planejar` em 8 planos |
| `planejar` | `planejar` | as 4 variantes + `bonus_parado=0` + mapa vazio + sem hub — plano **e** motivo (razões, selo, peso, ganho, forçado, essencial) |
| `_intercambiaveis_ficam` | o passe final do `planejar` | idem |
| `receita` + `_rotulo` + `_linha_de_hoje` | `receita` / `rot` | 8 receitas, título a título e linha a linha, com o selo de cada uma |
| `julgar` | `julgar` | 9 entradas × 6 aparelhos na mão = 54, mais 4 com `segurando` |
| `reexame` | `reexame` | 24/08 21h→22h50 (5 mudaram, 1 reconhecido) e leitura contra ela mesma |
| `consequencias` / `qualidade` | idem | 4 variantes cada |
| `plano_dos_controles` / `adaptadores_da_mesa` | `planoDosControles` / `adaptadores` | 1 a 4 controles, com e sem mic, todos num dongle, adaptador sumido, **sem adaptador nenhum** |

**120 cenários no oráculo, 114 testes verdes.** Todos comparam a estrutura
Python contra o JSON que o `node` imprimiu — não uma reimplementação do
esperado.

O ouro não pode envelhecer em silêncio:
`test_o_ouro_ainda_e_o_que_o_mockup_diz_hoje` roda o `node` de verdade e confere
que o JSON gravado continua sendo o que o mockup produz. Os outros 113 rodam sem
`node`. **Duas réguas independentes, de propósito.**

### O hub que sumiu às 02h36 é estado de primeira classe

A leitura de agora (`1-3` teclado, `1-4` DualSense no cabo, `1-6` mouse, `4-4`
Wi-Fi, hub ausente) está em `mesa_do_mockup.mesa_sem_hub()` e tem teste próprio
nos dois arquivos. Medido:

- `caminho_do_hub()` → `None`, e `regiao_do_caminho()` devolve `None` para tudo.
  **Sem hub não há topologia de hub para deduzir**, e a resposta honesta é essa;
- `sem_entrada()` acha o Wi-Fi e o mouse, com região `None`;
- `planejar`/`receita` continuam funcionando: 2 movimentos, nenhum estouro;
- `adaptadores_da_mesa()` → `()`, e `plano_dos_controles` devolve
  `cabe=False, sobra=0, destino={}`. **Nada cabe, e o motor diz isso.**

## Qual mordida prova

Cinco curas arrancadas **no fonte**, uma de cada vez, com `git` limpo entre
elas. Verde de partida: `114 passed`.

| cura arrancada | vermelho | verde de volta |
|---|---|---|
| **1. bônus de ficar parado** — `efetiva = nota.n + (op.bonus_parado if ...)` | `16 failed, 98 passed` | `114 passed` |
| **2. intercambiável não troca com o irmão** — a chamada de `_intercambiaveis_ficam` | `10 failed, 104 passed` | `114 passed` |
| **3. só melhora vira movimento** — `if de and motivo.ganho <= 0: continue` | `8 failed, 106 passed` | `114 passed` |
| **4. ninguém troca de adaptador sem baixar o pico** — `if pico_depois >= pico_antes: break` | `5 failed, 109 passed` | `114 passed` |
| **5. dedução dual-bus da região** — a segunda comparação de `regiao_do_caminho` | `1 failed, 113 passed` | `114 passed` |

Os nomes que caíram, na íntegra:

```
### 1 — bônus de ficar parado
FAILED test_arranjo_invariantes.py::test_o_bonus_de_ficar_parado_so_desempata
FAILED test_arranjo_invariantes.py::test_arrancado_o_bonus_mexendo_o_minimo_manda_mexer_em_mais
FAILED test_arranjo_invariantes.py::test_sem_usar_o_hub_so_estabiliza_na_segunda_volta
FAILED test_arranjo_invariantes.py::test_todo_aparelho_que_o_mapa_move_a_receita_manda_mover[melhor]
FAILED test_arranjo_invariantes.py::test_todo_aparelho_que_o_mapa_move_a_receita_manda_mover[poucos]
FAILED test_arranjo_invariantes.py::test_a_variante_que_proibe_a_entrada_de_hoje_quebra_mapa_igual_receita[sem-ext]
FAILED test_arranjo_invariantes.py::test_a_variante_que_proibe_a_entrada_de_hoje_quebra_mapa_igual_receita[so-pc]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_o_plano_e_o_mesmo_do_javascript[melhor|poucos|sem-ext|so-pc]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_e_a_mesma_do_javascript[melhor|poucos|sem-ext|so-pc]
    (16 no total)

### 2 — intercambiável não troca com o irmão
FAILED test_arranjo_invariantes.py::test_dois_dongles_identicos_nao_trocam_de_lugar_entre_si
FAILED test_arranjo_invariantes.py::test_arrancado_o_bonus_mexendo_o_minimo_manda_mexer_em_mais
FAILED test_arranjo_invariantes.py::test_a_variante_declara_o_que_perde
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_o_plano_e_o_mesmo_do_javascript[4 variantes]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_e_a_mesma_do_javascript[melhor]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_sem_o_bonus_de_ficar_parado_bate_tambem
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_do_mapa_vazio_e_do_mapa_torto
    (10 no total)

### 3 — só melhora vira movimento
FAILED test_arranjo_invariantes.py::test_ganho_negativo_nao_vira_ordem_de_servico
FAILED test_arranjo_invariantes.py::test_arrancado_o_filtro_a_receita_manda_mexer_a_toa
FAILED test_arranjo_invariantes.py::test_arrancado_o_bonus_mexendo_o_minimo_manda_mexer_em_mais
FAILED test_arranjo_invariantes.py::test_a_variante_que_proibe_a_entrada_de_hoje_quebra_mapa_igual_receita[sem-ext|so-pc]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_e_a_mesma_do_javascript[sem-ext|so-pc]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_sem_o_bonus_de_ficar_parado_bate_tambem
    (8 no total)

### 4 — a guarda do pico dos controles
FAILED test_arranjo_invariantes.py::test_ninguem_troca_de_adaptador_sem_baixar_o_pico
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_distribuicao_dos_controles_e_a_mesma[2]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_distribuicao_dos_controles_e_a_mesma[4]
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_o_microfone_e_o_unico_que_muda_a_conta
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_os_quatro_no_mesmo_dongle_e_o_adaptador_que_sumiu

### 5 — a dedução dual-bus
FAILED test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_regiao_sai_do_barramento[4-1.1.2]
```

### As duas regras que salvam a credibilidade, com o número medido

**Intercambiável não troca com o irmão.** Sobre a leitura de 20h15 de 24/08 (a
que casa com as 8 entradas declaradas), a receita de `O melhor no papel`:

```
COM a regra ..... 5 movimentos
SEM a regra ..... 7 movimentos
os dois a mais:
    Mova o dongle Bluetooth da entrada 15a para a 9
    Mova o dongle Bluetooth da entrada 9 para a 15a  ·  melhora, não é urgente
```

**São dois UB500 idênticos trocando de lugar entre si.** Trabalho puro, ganho
zero, e é o número `5 → 7` que a sprint cita.

**Ficar parado vale bônus.** Sobre a mesma leitura:

```
Mexendo o mínimo, COM o bônus ..... 4 movimentos
Mexendo o mínimo, SEM o bônus ..... 5 movimentos
o extra: Mova a webcam da entrada 6 para a 2  ·  melhora, não é urgente

O melhor no papel, COM o bônus ..... o hub FICA na entrada 4 (onde ele está)
O melhor no papel, SEM o bônus ..... o plano tira o hub da 4 e o põe na 3
                                     — duas entradas de nota idêntica
```

**Ninguém troca de adaptador sem baixar o pico.** Dois adaptadores, controles
com microfone (277 de 1600 cada):

```
4 controles em 2+2 ......... 0 movimentos   carga 554 / 554
4 controles todos num só ... 2 movimentos   carga 554 / 554
3 controles em 2+1 ......... 0 movimentos   carga 554 / 277
```

O terceiro caso é o que só a guarda do pico resolve: mover deixaria
`max(554-277, 277+277) = 554`, o mesmo pico. Arrancada a guarda, o plano manda
mover e fica oscilando até o teto de voltas.

### Os portões

```
ruff check src/ tests/ .................. All checks passed!
mypy src/hefesto_dualsense4unix ......... Success: no issues found in 213 source files
validar-acentuacao.py --all ............. limpo
validar-glifos.py --all ................. limpo
validar-referencias-docs.py --all ....... 9 mortas, TODAS de outra frente
                                          (2026-08-25-CALIBRAR-AS-ENTRADAS-01)
check_anonymity.sh ...................... OK: anonimato preservado.
check_version_consistency.py ............ OK: 12 alvo(s) em 0.9.4.5
check_packaging_parity.sh ............... paridade de empacotamento OK
check_test_data.sh ...................... OK: dados de teste neutros.
check_endereco_de_radio.py .............. OK: nenhum endereço de rádio real
validar-caducos.py --all ................ OK
check_faixa_sintetica.py ................ VERMELHO PREEXISTENTE, ver abaixo
pytest do escopo ........................ 114 passed
pytest dos portões de varredura ......... 32 passed
   (acentuacao_uma_passada_so, a_suite_nao_cria_aparelho_no_kernel,
    docs_mac_anonimato)
```

O `check_faixa_sintetica.py` acusa quatro MACs de fixture no
`~/.config/hefesto-dualsense4unix/controllers.json` **vivo** dela — é
exatamente o achado que o `CLAUDE.md` já descreve, de 22/08, com a causa
nomeada (`app/gui_prefs.py:21` congelando o caminho na importação). **Nada meu
chega perto disso**: o módulo é puro e os testes não importam `xdg_paths` nem
escrevem em `config_dir()`. Não mexi.

Dois avisos de instrumento, para quem vier depois:

- `python3 scripts/check_faixa_sintetica.py` estoura com
  `ModuleNotFoundError: platformdirs`. É o `python3` do sistema, não o defeito.
  Use `.venv/bin/python` — a lista de portões do `CLAUDE.md` escreve `python3`
  para este, e isso vai enganar alguém;
- `scripts/portoes.sh` **não existe** nesta árvore. Usei o bloco literal do
  `CLAUDE.md`, pulando o `pytest -q` completo.

## O que NÃO verifiquei

- **A suíte inteira.** Rodei o meu escopo e três portões de varredura. Não sei o
  que outras frentes deixaram vermelho.
- **A tela.** O módulo não desenha nada e nenhuma foto foi tirada. `retratar_abas.py`
  não foi rodado, por regra.
- **Se a GUI consegue mostrar o texto da receita como ele sai.** As frases
  carregam HTML do mockup (`<b>`, `<code>`) — ver a divergência 4 abaixo.
- **Nada com hardware.** Bancada não foi pedida nem usada; o módulo é puro.
- **`MOTOR-5`, `MOTOR-6`, `MOTOR-7`** — fora do meu escopo, por ordem. Não abri
  `app/`, `install.sh` nem `maquina.json`.
- **Se o motor está certo**, só se ele está **igual**. A equivalência prova que a
  porta não mudou o cálculo; ela não prova que o cálculo do mockup é bom. As
  notas da tabela do §5 continuam sendo desenho de 24/08, não medição de rádio.

## O que sobrou para o próximo

### As quatro divergências entre a sprint e o mockup — e o mockup é o que RODA

**1. `5 → 7` é da regra do irmão, não do bônus de ficar parado.** A MOTOR-2 diz
*"Arrancar o bônus de ficar parado faz a receita saltar de 5 para 7 movimentos"*.
**Medido: não faz.** Arrancado o bônus sozinho, a receita continua com 5 — o que
muda é o *destino* (o Wi-Fi vai para a 4 em vez da 3, porque o hub sai da 4). Quem
leva de 5 a 7 é o passe dos intercambiáveis, e os dois a mais são a troca dos
UB500 entre a 9 e a 15a. O `LEIA.md` do mockup diz *"sem **elas**"*, no plural, e
está certo; a sprint atribuiu o número à regra errada. **Segui o mockup**, e o
teste nomeia cada uma pelo número que ela de fato move.

**2. `ponto fixo` vale em TRÊS variantes, não nas quatro.** A MOTOR-2 pede *"aplicar
o plano e replanejar dá zero movimentos, nas quatro variantes"*. Medido: `O melhor
no papel`, `Mexendo o mínimo` e `Sem o extensor` são ponto fixo de primeira.
**`Sem usar o hub` precisa de uma segunda volta** — aplicado o plano, o replanejo
ainda manda 3 movimentos; na volta seguinte, zero. Oito entradas de gabinete para
oito aparelhos não deixam folga, e a ordem de decisão manda num arranjo diferente
do que ela acabou de aplicar. Registrado em
`test_sem_usar_o_hub_so_estabiliza_na_segunda_volta`. **É o caso do notebook** —
a variante que a sprint diz ser boa parte do público.

**3. `mapa = receita` tem um buraco, e é justo nas variantes com restrição.**
A MOTOR-2 promete *"todo aparelho cuja entrada do plano difere da atual ESTÁ na
receita"*. Medido: vale em `O melhor no papel` e `Mexendo o mínimo`; **falha em
`Sem o extensor` e em `Sem usar o hub`**. A causa é a interação de duas regras que,
cada uma, está certa:

```
Sem usar o hub, leitura de 22h50:
  bt-a: hoje na entrada 9 (hub) -> o plano o põe na 5, ganho -60
  bt-b: hoje na entrada 15a     -> o plano o põe na 7, ganho -130
  a receita não manda mover nenhum dos dois, porque ganho <= 0
```

A variante **proíbe** a entrada de hoje, então o planejador precisa realojar o
dongle; mas a nota da entrada nova é pior que a da atual, e o filtro
*"só melhora vira movimento"* engole a ordem. **Quem olha o mapa vê o dongle
noutro lugar e não recebe ordem nenhuma** — que é exatamente o defeito F que a
invariante existe para matar, sobrevivendo dentro dela.

Não consertei: qualquer conserto muda o cálculo, e o cálculo é o que o teste de
equivalência trava. **A decisão é de quem coordena.** O conserto provável é uma
linha: quando a entrada de hoje está *proibida pela variante*, o movimento é
**forçado**, como já é quando ela foi *tomada por outro aparelho* — o campo
`forcado` e o `ganho = inf` já existem para isso. Está registrado em
`test_a_variante_que_proibe_a_entrada_de_hoje_quebra_mapa_igual_receita`, que
**reprova no dia em que o buraco fechar** e manda reescrever o texto.

**4. A receita devolve HTML, e a GUI não fala esse HTML.** As frases vêm do
mockup com `<b>` e `<code>`: `"Hoje ele está na entrada <b>9</b>
(<code>3-1.2</code>)."` Portei **byte a byte**, porque é o que torna a
equivalência demonstrável — mas `<code>` **não é Pango markup**, e um
`Gtk.Label` com `use_markup` vai reclamar ou engolir. Quem fizer a MOTOR-5
precisa de uma camada de conversão (ou de trocar `<code>` por `<tt>`), e essa
troca **quebra o teste de equivalência** de propósito: é decisão de tela, não de
motor.

### O resto

- **A costura com o `maquina.json` é uma linha.** O motor recebe `Mesa(aparelhos,
  faces, mapa, leitura)` por argumento. Quando a A5 fechar o campo `mapa`, basta
  um construtor que traduza o JSON para `Mesa`. Não escrevi esse construtor,
  para não colidir.
- **`faixa(usado)` ficou de fora**, de propósito: a régua das três faixas
  (Folgada / Apertada / Cheia) tem dono em `DESEMPENHO-A-CONTA-DE-SLOTS-01`, e
  duplicá-la aqui seria a segunda verdade. O que ficou é `SLOTS = 1600`,
  `CUSTO_SEM_MIC = 260`, `CUSTO_COM_MIC = 277` e o `cabe`/`sobra` que a
  `plano_dos_controles` precisa.
- **`PERFIS`, `MIGRACAO`, `LICOES` e `NA_MAO` também ficaram de fora** — são
  vocabulário de tela, e a `CONFIGURACOES-O-LEXICO-01` e a
  `O-PRECO-EM-BATERIA-01` são as donas.
- **Três generalizações declaradas** (mesma saída em todos os 120 cenários): o
  Wi-Fi e o hub saem pela **classe**, não pelo `id` literal `"wifi"`/`"hub"`; o
  estado entra por argumento em vez de variável de módulo; e uma entrada do mapa
  que não existe em face nenhuma vira *"não tem entrada de hoje"* em vez de
  estourar, que é o que o JavaScript faria.
- **`reexame` mudou de assinatura.** A sprint escreve `reexame(antes, agora,
  mapa)`; ficou `reexame(mesa, antes, agora)`, porque a `Mudanca` precisa do
  aparelho e a `Mesa` já carrega o mapa **e** os aparelhos.
- **O motor continua sem conhecer rádio vizinho** que não está na mesa —
  roteador, TV, micro-ondas —, como a §10 da sprint já anota. A aba pode mandar
  mover dongle para sempre sem tocar na causa.
