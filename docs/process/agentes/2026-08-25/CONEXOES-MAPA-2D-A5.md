# CONEXÕES · MAPA 2D 01 — A5

Branch `voo/CONEXOES-MAPA-2D-A5`, árvore
`hefesto-voo/CONEXOES-MAPA-2D-A5`. 25/08/2026, madrugada.

Sete das oito tarefas fechadas: `MAPA-1` a `MAPA-7`. A `MAPA-8` é bancada e é
dela.

## O que mudou

### `MAPA-1` — o esquema, e a `version` NÃO subiu

`src/hefesto_dualsense4unix/utils/maquina.py`

Três modelos novos — `FaceDeclarada`, `PortaDeclarada`, `MapaDaMesa` — e o
campo `mapa` em `MaquinaConfig`, com `default_factory`. `MAQUINA_SCHEMA_VERSION`
continua `1`, e a linha que diz por quê mora no próprio campo.

As três regras de validação da sprint entraram todas:

| regra | forma |
|---|---|
| o caminho é o nome do kernel | `^[0-9]+-[0-9]+(\.[0-9]+)*$` |
| o número é o que ela escreveu | `^[0-9]{1,3}[a-z]?$` |
| teto de faces e de entradas | 8 faces, 64 entradas (a união das faces com o dicionário) |

**Uma mudança que a sprint não previu e que é necessária:** `_podar` passou a
tirar **lista vazia**, além de `None` e `{}`. Sem isso, quem nunca desenhou a
mesa passaria a carregar um `"mapa": {"faces": []}` em disco — silêncio escrito
por extenso, que é o que aquela função existe para não deixar acontecer. Nenhum
outro campo do documento é lista, então a regra nova não alcança nada que já
estivesse lá. Tem teste próprio.

### `MAPA-2` — o caminho de barramento virou propriedade

`src/hefesto_dualsense4unix/integrations/mesa_de_radio.py`

`Adaptador.caminho` e `RadioUsb.caminho` devolvem `f"{busnum}-{devpath}"`, que é
exatamente o `nome_do_kernel` do censo. `""` quando falta metade — o adaptador
embutido, que não pendura em USB nenhum. Uma função privada
(`_caminho_de_barramento`) serve as duas classes: duas montagens independentes é
como se produzem duas palavras que quase batem.

### `MAPA-3` e `MAPA-6` — o módulo de junção

`src/hefesto_dualsense4unix/integrations/mapa_das_portas.py` (novo, ~430 linhas
com cabeçalho). Funções puras, sem GTK, sem IPC, sem `/dev`.

- `porta_de`, `caminho_de`, `filhas_de` — as traduções;
- `portas_livres(mapa, censo)` — a entrada que hospeda uma extensão **não** é
  livre: o cabo ocupa o buraco;
- `vizinhas_de_verdade(mapa, censo)` — vizinhança pelo DESENHO dela, e a
  entrada por extensão sai da fileira;
- `incoerencias(mapa, censo)` — a `MAPA-6`, com a exceção do hub de dois
  barramentos;
- `porta_do_adaptador(mapa, adaptadores, enderecos_do_bluez, *, ler_serial)` —
  o casamento do §2.5;
- `resumo_do_mapa(mapa, censo)` — os três números da linha da `MAPA-5`.

**A âncora de uma face é deduzida, não declarada,** e isso não estava resolvido
na sprint. O esquema não tem campo dizendo "a face Hub pendura na entrada 4". A
regra que escrevi: a âncora é o hub de que a **maioria** das entradas daquela
face pendura, com empate resolvido pelo hub mais EXTERNO (a face é o plástico
inteiro, não um dos chips dele). Face cujas entradas penduram direto na placa
não tem âncora, e face sem âncora **nunca acusa ninguém** — que é o que faz o
mapa servir a um notebook.

**O serial não sobrevive à função.** `porta_do_adaptador` recebe um
`ler_serial` injetável, lê, casa e descarta. Nada de serial em atributo de
`dataclass`, em log, em tela ou em `maquina.json`.

### `MAPA-4` — a janela do desenho

`src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py` (novo)

Dividido como o `segmented_selector`: `LogicaDoMapa` é o rascunho e os gestos,
sem uma linha de GTK; `JanelaDoMapaDaMesa` é a janela, sob guarda de
`_GTK_DISPONIVEL`. Gesto de dois tempos: clique no aparelho, clique na entrada.
Botões "Tirar daqui", "Tem uma extensão aqui", "Acrescentar entrada",
"Acrescentar face". Grava em `host._maquina_pendente` e **nunca** chama
`machine.declare`.

Três invariantes que o código carrega e o teste cobra:

1. **um aparelho está em UM lugar** — pôr onde ele não estava o tira de onde
   estava, no mesmo gesto;
2. **nenhuma face nasce sozinha** — o mapa vazio abre com zero faces, e abrir a
   janela não suja o rascunho;
3. **a entrada por extensão não entra na fileira** — ela desenha dentro do
   quadrado de quem a hospeda, senão a fileira de sete do hub vira oito e o
   desenho deixa de bater com o metal.

### `MAPA-5` — a linha e o botão dentro de "Conexões"

`src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py`

Uma função de módulo, `_linha_do_mapa(mapa, censo, ao_clicar)`, e um
`pack_start` logo abaixo da tabela de adaptadores. Medido nesta árvore: a linha custa **40 px** de altura de seção (436 px com
ela, 396 px sem), contra o teto de 48; a grade das três faces no mesmo lugar
custaria **257 px**.

### `MAPA-7` — o número chega ao texto

`_onde_esta_o_adaptador` e `_onde_esta_o_radio` ganharam um parâmetro `mapa`
opcional. Com mapa: `"Entrada 9"`, e o caminho do sistema desce para a dica.
Sem mapa: **exatamente** o texto de hoje, sem uma vírgula de diferença.

### O que o portão me obrigou a mexer, e estava na minha posse

`src/hefesto_dualsense4unix/app/ipc_bridge.py` — `_CAMPOS_DA_MAQUINA` ganhou
`"mapa": "O desenho da mesa"`. Há portão que exige um rótulo de tela para cada
campo de topo do schema (`test_descartados_chegam_ao_rodape.py`), e ele reprovou
assim que o campo entrou. O rótulo **não** é um `TITULO` de seção, e é o único
assim: o mapa não tem seção própria. Ele nomeia o que se PERDE.

## Qual mordida prova

Todas exercidas na árvore, hoje. Cada bloco é a saída com a cura arrancada e
com a cura devolvida.

### `MAPA-1` — `test_documento_da_v1_continua_sendo_lido`

Cura arrancada: `MAQUINA_SCHEMA_VERSION = 2` e `version: Literal[2] = 2`.

```
E  AssertionError: o documento da v1 deixou de ser lido: mesa.altura_da_antena
   voltou como None, e não como a pessoa declarou. É o que acontece na máquina
   de quem já declarou quando a versão sobe
E  assert None == 'acima'
1 failed
```

Cura devolvida: `20 passed in 0.24s`

### `MAPA-2` — `test_o_caminho_do_adaptador_bate_com_o_do_censo`

Cura arrancada: `f"{busnum}-{devpath.replace('.', '-')}"`, o erro plausível.

```
E  AssertionError: os dois módulos leram o mesmo barramento e não falam a mesma língua.
E      do adaptador: ['3-1-1-1', '3-1-1-4']
E      do censo:     ['1-3', '1-6', '3-1', '3-1.1', '3-1.1.1', '3-1.1.4', '3-1.2', '4-1', '4-1.1', '4-4']
1 failed, 2 passed
```

Cura devolvida: `3 passed in 0.22s`

### `MAPA-3` — `test_dois_adaptadores_de_mesmo_vid_pid_recebem_entradas_distintas`

Cura arrancada: `porta_de(mapa, f"{a.vid}:{a.pid}")`, a chave de hoje.

```
E  AssertionError: os dois adaptadores idênticos deixaram de receber entradas
   distintas: {}. É a aba inteira perdendo a capacidade de distinguir os
   aparelhos que ela existe para distinguir
E  assert set() == {'13', '15a'}
1 failed, 10 passed
```

Cura devolvida: `11 passed in 0.24s`

### `MAPA-6` — `test_o_wifi_no_lado_usb3_do_mesmo_hub_nao_acusa`

Cura arrancada: `_mesmo_plastico_em_dois_barramentos` devolvendo `False` — a
comparação de prefixo crua.

```
E  AssertionError: o produto acusou a mesa dela de estar errada. O hub de dois
   barramentos é UM plástico, e o lado 3.0 dele enumera noutro barramento de
   propósito: (Incoerencia(face='Hub', porta='11', caminho='4-1.1.2', ancora='3-1'),)
E  AssertionError: esperava uma acusação e vieram 2
2 failed, 3 passed
```

A acusação falsa é exatamente a entrada 11, como a sprint previu. O segundo
vermelho é o irmão que impede a cura preguiçosa ("nunca acusar nada").

Cura devolvida: `5 passed in 0.22s`

### `MAPA-4` — `test_tirar_daqui_apaga_a_entrada_no_disco`

Cura arrancada: `_esvaziar` trocado por `self.portas.pop(numero)` — a versão
"a chave some do rascunho" que a sprint pedia.

```
E  AssertionError: a entrada esvaziada continuou no ARQUIVO depois do Aplicar:
   {'1': ..., '9': {'caminho': '3-1.2'}, ...}. É o que acontece quando o gesto
   de tirar apaga a chave do rascunho em vez de escrever None: a chave ausente
   manda a gravação preservar o que estava no disco
1 failed, 9 passed
```

Cura devolvida: `10 passed in 0.52s`

### `MAPA-5` — `test_a_secao_ganha_no_maximo_uma_linha`

Cura arrancada: a grade das faces dentro de `_linha_do_mapa`.

```
E  AssertionError: a linha do mapa custou 257 px, e o teto é 48. Com: 653 px.
   Sem: 396 px. A seção já pede 2465 px numa janela de 1080 — o que passar
   daqui nasce abaixo da dobra
1 failed, 3 passed
```

Cura devolvida: `4 passed in 0.43s`

### `MAPA-7` — `test_com_mapa_a_frase_traz_o_numero_dela`

Cura arrancada: o ramo do mapa em `_onde_esta_o_adaptador`.

```
E  AssertionError: a coluna não trouxe o número dela: 'Barramento 3, porta 1.2 · Direita'
E  assert 'Barramento 3...1.2 · Direita' == 'Entrada 9'
E  AssertionError: a entrada por extensão não chegou: 'Barramento 3, porta 1.1.4 · Não sei · Em hub'
```

Cura devolvida: `7 passed in 0.43s`

### O escopo inteiro

```
64 passed in 1.42s
```

(oito arquivos: `test_mapa_a_bancada_de_mentira.py`,
`test_mapa_da_mesa_sobrevive_a_versao.py`,
`test_mapa_da_mesa_fala_a_mesma_lingua.py`,
`test_mapa_das_portas_responde_pela_porta.py`,
`test_o_hub_de_dois_barramentos_nao_e_incoerencia.py`,
`test_a_janela_do_mapa_coloca_o_aparelho.py`,
`test_conexoes_nao_engorda_com_o_mapa.py`,
`test_a_porta_dela_chega_na_frase.py`)

E as vinte e duas baterias existentes que tocam os arquivos que mudei:
`265 passed` depois do rótulo em `ipc_bridge`.

## O que NÃO verifiquei

- **A prova de tela (D3) não fechou, e três tarefas dependem dela.** `MAPA-4`,
  `MAPA-5` e `MAPA-7` mexem no que ela lê. Todo texto novo está marcado
  `PROVISÓRIO — decisão dela` no código. **Aguarda o olho dela.** Não
  fotografei nada: a foto oficial é uma execução única, no fim da leva, de quem
  coordena.
- **A `MAPA-8` não foi executada** — é bancada e é dela. O comando exato está
  na seção seguinte.
- **Três adaptadores do mesmo `vid:pid`.** A sprint pedia três; a leitura de
  02h30 tem DOIS (o terceiro virou o DualSense no cabo, em `3-1.2`). A
  propriedade é a mesma e a mordida também — o que colapsa sob `vid:pid`
  colapsa com dois tanto quanto com três —, mas o caso de três não foi medido
  nesta árvore.
- **A janela do mapa nunca foi mostrada numa tela.** Os testes exercitam os
  sinais dos botões sem `show()`, porque sob Xvfb não há gerenciador de janelas
  e uma `Gtk.Window` mostrada fica 1x1 para sempre. **Não sei como ela se
  parece.** Layout, quebra de fileira, tamanho dos quadrados e legibilidade dos
  rótulos são todos NÃO VERIFICADOS.
- **Não medi nada em `/sys` desta máquina.** Toda a bancada é de mentira, e há
  teste que prova que nenhum caminho começado em `/sys` foi tocado.
- **`scripts/check_endereco_de_radio.py` não existe nesta árvore** — é arquivo
  novo, ainda só no índice da árvore dela. O portão do bloco do `CLAUDE.md` não
  pôde rodar aqui. Os outros nove rodaram, todos verdes.
- **Estabilidade do caminho de barramento num notebook com dock** continua NÃO
  VERIFICADA, como a sprint já dizia. Aqui é PC de mesa.

## O que sobrou para o próximo

### 1. O portão da casa precisa de quatro declarações, e o arquivo não é meu

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` **é da frente A3 nesta
leva**, então eu relatei em vez de editar.

**Estado medido.** Sem as minhas mudanças, esta branch já tem **2 vermelhos**
naquele arquivo (`test_toda_promessa_solta_esta_classificada` acusando quatro
símbolos de `app/fala_do_mapa.py`, `app/textos_de_aplicacao.py` e
`profiles/schema.py`; e `test_nenhuma_lapide_sobreviveu_a_propria_cura` acusando
`utils/maquina.py::gravar_maquina`). Nenhum dos dois é meu.

**O que eu acrescentei:** 79 promessas soltas viraram **83**, e o teto declarado
é 80. As quatro são exatamente as que a sprint diz serem da Frente B e da
Frente C:

```
integrations/mapa_das_portas.py::incoerencias
integrations/mapa_das_portas.py::porta_do_adaptador
integrations/mapa_das_portas.py::portas_livres
integrations/mapa_das_portas.py::vizinhas_de_verdade
```

**Não inventei consumidor para elas** — inventar um seria escrever a frase de
tela que é de outra frente, e o portão está certo em notar. O conserto é o que a
própria casa prescreve: quatro entradas em `_SEM_CAMINHO_HOJE` dizendo quem as
liga, e o teto de 80 para 84. O gancho de cada uma:

- `incoerencias` e `portas_livres` — a **Frente B**, a ordem de serviço: são a
  matéria-prima de *"tem entrada livre na traseira; este dongle está no hub"*;
- `vizinhas_de_verdade` — a **Frente B** também, e a sprint pede explicitamente
  que ela consuma esta função em vez de mexer em
  `mesa_de_radio.vizinhancas_apertadas`;
- `porta_do_adaptador` — a **Frente C**, o medidor por adaptador: é o que
  transforma `ocupacao_por_adaptador` em *"o Jogador 2 está na entrada 15a"*.

### 2. A `MAPA-8` é dela, e o comando está pronto

Com um adaptador Bluetooth de outro fabricante plugado, **sem `sudo`**:

```bash
for n in /sys/bus/usb/devices/*/serial; do
  d=$(dirname "$n")
  printf '%-40s %-12s %s\n' "$d" "$(cat "$d/idVendor" 2>/dev/null)" "$(cat "$n")"
done
```

e, do lado do BlueZ, o endereço que ele reporta para o mesmo aparelho.

**Nada trava por causa disso.** Se casar, a afirmação "o Jogador 2 está na
entrada 15a" sai para todo mundo; se não casar, ela sai só quando o serial bate
— que já é como `porta_do_adaptador` está escrita.

### 3. As duas decisões que eu tomei porque a sprint deixou em aberto

- **A âncora de uma face é deduzida** (maioria, empate no hub mais externo). O
  esquema não tem campo para "o cabo desta face está na entrada 4", e
  acrescentar um criaria um segundo dono do fato que a face já guarda. Se ela
  preferir declarar, é campo novo em `FaceDeclarada` e não quebra nada — o
  arquivo dela continua válido.
- **"Tirar daqui" escreve `caminho: None`, não apaga a chave.** A sprint pedia
  que a chave sumisse do rascunho; o próprio `utils/maquina.py` diz por que
  isso está errado — chave ausente é o que manda a gravação **preservar** o que
  está no disco, e o aparelho tirado voltaria no "Aplicar" seguinte. O teste
  cobra onde importa: depois do "Aplicar", a entrada não está no arquivo.

### 4. Colisões que eu vi

- **`secao_mesa.py`** — toquei `_onde_esta_o_adaptador`, `_onde_esta_o_radio`, a
  montagem em `_PainelDaMesa.montar`, e **duas linhas a mais** que a sprint não
  previa: as chamadas dentro de `_desenhar_adaptadores` e `_desenhar_radios`,
  que passam o mapa. As constantes novas (`_ENTRADA_DELA`,
  `_PROCEDENCIA_DA_ENTRADA`, `_RESUMO_DO_MAPA`, `_SEM_MAPA`,
  `_BOTAO_DESENHAR`) ficaram no **fundo** do arquivo, na região de tradução, e
  **nenhuma começa por `_DICA_`** — de propósito: o topo e os `_DICA_*` são da
  frente do léxico.
- **`utils/maquina.py`** — `MAQUINA_SCHEMA_VERSION` continua `1`. Quem chegar
  depois com outro campo novo, confira isso.
- **`_podar` mudou de comportamento** (lista vazia sai). Se outra frente
  acrescentar um campo de lista ao documento, ele passa a ser podado quando
  vazio — que é o certo, mas é bom saber.
- **`ipc_bridge._CAMPOS_DA_MAQUINA`** ganhou uma entrada. Se outra frente
  acrescentar campo de topo ao schema, precisa de rótulo lá também — há portão.

### 5. O que a sprint listou e continua fora

A ordem de serviço (Frente B), o medidor por adaptador (Frente C), a cor da
moldura do quadrado por estado (mora no `theme.css` e merece uma passada única),
editar a face por arrastar a ordem, e exportar o mapa para o `doctor` — que é
onde o §2.5 volta a morder: **o relatório não pode levar serial**.
