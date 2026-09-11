# OS-VINTE-E-SEIS-VERMELHOS-01 — quinze dos vinte e cinco, e os nove eram um só

**Árvore:** `hefesto-voo/OS-VINTE-E-SEIS-VERMELHOS-01-opus`, branch
`voo/OS-VINTE-E-SEIS-VERMELHOS-01-opus`, nascida de `onda/0911b` (`908864de`,
conferido contra `git rev-parse --short onda/0911b`).

**Bancada:** não precisou. `bancada: false` no frontmatter, e nenhum caminho
desta sprint para o daemon, o `hidraw` ou o `systemctl`. Nenhuma janela foi
aberta: o trabalho inteiro é de régua.

## O que mudou

**Quinze dos vinte e cinco vermelhos fecharam.** Cada um foi rodado SOZINHO
antes de eu acreditar no vermelho — os vinte e cinco reprovam isolados, nenhum
é contaminação por ordem. Rodados juntos depois da cura: `10 failed, 229
passed`, e os dez são exatamente os diagnosticados como fora da posse.

### 1. Os NOVE do `test_a_aba01_le_o_estado_em_vez_de_cravar.py` — UMA causa

A §3 da sprint apostou que os nove tinham causa única. Tinham, e ela é a
família que esta casa persegue: **o instrumento respondia sobre a máquina, não
sobre o produto.**

Em 06/09 a cura do travamento do USB virou mais uma fonte de
`a01_jogar._avisos`. Ela não pergunta ao `state` que os testes montam: lê o
disco — `/sys/module/snd_usb_audio/parameters/quirk_flags` e
`/etc/modprobe.d/hefesto-dualsense-storm.conf`. Medido aqui em 11/09:

```
SELO: '[INFO]'   (OK seria '[ OK ]')
FRASE: a cura do travamento está agendada. O que fazer: desconecte e
       reconecte os controles para ela valer agora.
/sys/module/snd_usb_audio/parameters/quirk_flags        NÃO EXISTE
/etc/modprobe.d/hefesto-dualsense-storm.conf            existe
```

Na máquina dela o mesmo `check_snd_quirk` responde `[ OK ]` e as nove passam.
Aqui entra uma linha de selo `CONTROLE` na coluna Atenção, e as nove reprovam
com nove diffs diferentes da mesma causa.

O arquivo IRMÃO (`test_a01_a_coluna_atencao_acende_o_mais_grave.py`) já a
calava desde que ela nasceu, com a razão escrita no `_so_estes` dele. Este não
foi junto.

**A cura fecha a família, não só a fonte que gritou:** `_sem_a_maquina()` cala
as DUAS fontes que perguntam ao hardware — a cura do travamento e o `_do_exame`
(que chama `a08_conexoes._exame()`, os controles que estão na mesa AGORA). O
`_do_exame` cala hoje nesta máquina; com os quatro DualSense na bancada dela
derrubaria as mesmas quatro réguas do selo `JOGO` por outro nome. Calar um e
deixar o outro seria pagar este diagnóstico duas vezes.

**E nasceu a régua que faltava em 06/09:**
`test_nenhuma_fonte_fala_sem_este_arquivo_saber` reprova UMA vez e diz o campo
`fonte` de quem falou — o endereço exato da função a acrescentar. O limite dela
está declarado: pega a fonte nova que FALA na máquina em que a suíte roda.

### 2. Os DOIS do `test_a_fita_diz_o_controle_que_esta_na_mesa.py`

A régua media a MARCAÇÃO de ontem. Em 08/09 `monta.rotulo_do_chip` passou a
marcar o último degrau (`<span class="via">USB</span>`) porque a decisão dela —
*"cabo e rádio coloca maiúsculo"* — virou `text-transform` na folha e não caixa
alta no documento. O texto na tela não mudou; `_nome_escrito` comparava a linha
CRUA com a sigla. Cura: `_so_o_texto()` tira a marcação antes de comparar — o
que a fita AFIRMA é texto, e cravar aqui a marcação de hoje seria a segunda
cópia de uma decisão de folha de estilo.

### 3. `test_sn30_…::test_as_nove_linhas_de_combinacao_…` — o MAPA venceu

A régua exigia que as nove `combinacao.*@sn30` continuassem MUDAS. O commit
`49118905` (*"o CSV responde o que o código sabe"*) respondeu as nove, com
procedência declarada — seis `inferido-do-codigo`, o resto `afirmado-no-doc` ou
`incerto`. Ordem dela de 06/09: *"o csv do specs e o mapa vencem a sprint em
termo de informações precisas. sempre."*

O que a régua antiga protegia DE VERDADE continua: a bancada do SN30 nunca
aconteceu, então nenhuma das nove pode dizer `medido`. Renomeada para
`test_as_nove_linhas_de_combinacao_nunca_afirmam_medido_sem_bancada`, e a
palavra da procedência forte passou a ser IMPORTADA do dono
(`check_paridade_transporte.DE_ONDE_SEI_FORTE`) em vez de digitada.

### 4. `test_identidade_do_aplicativo_01` — a permissão apontava para o vazio

`PONTOS_DE_TRANSICAO` declarava `app/main.py` e `app/app.py` como os lugares
que ainda podem nomear o id antigo. O commit `f5311616` (*"a janela GTK sai"*,
`D-0609-GTK-LEVA-INTEIRA`) **apagou os dois arquivos do disco**. O sentido 2 da
régua — *"todo arquivo da lista ainda o nomeia"* — reprovou por isso, como
nasceu para fazer. Quem herdou o assunto já estava na lista:
`utils/identidade.py`, dono dos padrões de matança desde 29/08.

### 5. `test_validar_referencias_docs` — e ele pegou um instrumento FALSO junto

A régua usava `gui/main.glade` como o nome do arquivo de mentira. Esse nome
entrou em `APOSENTADOS` do validador quando a janela saiu (as 783 citações dos
quatro artefatos apagados são isentas por nome). A partir daí:

* `test_caminho_encurtado_casa_por_sufixo` continuou VERDE — **pela isenção,
  não pela leniência**. Instrumento falso, e ninguém o via;
* `test_link_que_sobe_nao_ganha_a_leniencia_de_sufixo` ficou VERMELHO, e foi
  ele que revelou os dois.

**O par é a guarda, e funcionou por construção:** uma isenção não consegue
fazer as duas passarem, porque elas esperam vereditos OPOSTOS sobre o mesmo
nome. Cura: `ARQUIVO_ANINHADO = "gui/janela-de-mentira.glade"` — um nome que o
produto não tem não pode ser aposentado pelas costas destas réguas.

### 6. `test_causa_nao_declarada_z6_05` — o portão ficou mais duro

A régua dizia *"só `de_onde_sei = medido` cobra causa"*. Em 06/09 a regra 16
perdeu essa metade de propósito, e o `check_paridade_transporte` escreve a
razão no comentário do próprio `if`: um `não` de célula não medida era o mais
ambíguo de todos, e *"foi lendo um desses que o coordenador mandou um agente
PARAR um passo que funciona"*. Reescrita como
`test_a_causa_nao_depende_do_de_onde_sei`, que cobra os DOIS sentidos sobre o
mesmo `inferido-do-codigo` — com causa passa, sem causa reprova.

## Qual mordida prova

**1. Os nove — a cura arrancada, e a régua nova NOMEIA a causa.** Tirei a
linha da cura de `_sem_a_maquina` e rodei:

```
10 failed, 18 passed
FAILED ... test_o_aviso_do_jogo_sem_atalho_acende_na_coluna
FAILED ... test_as_duas_recusas_dela_calam_a_coluna_atencao[dispensa]
FAILED ... test_as_duas_recusas_dela_calam_a_coluna_atencao[tirar-daqui]
FAILED ... test_a_recusa_de_outro_jogo_nao_cala_este
FAILED ... test_sem_appid_o_aviso_continua
FAILED ... test_uma_boa_noticia_nao_entra_na_coluna_atencao
FAILED ... test_a_conta_e_a_do_produto_e_conta_o_que_a_coluna_mostra
FAILED ... test_a_linha_sem_aviso_nao_fica_com_travessao
FAILED ... test_a_coluna_nao_estoura_o_que_a_pagina_publica
FAILED ... test_nenhuma_fonte_fala_sem_este_arquivo_saber
```

E a décima, que é a nova, disse exatamente o que fazer:

```
AssertionError: uma fonte que este arquivo não conhece acendeu a coluna:
storm_doctor.check_snd_quirk (CONTROLE) — acrescente-a a `_sem_a_maquina`
se ela perguntar à máquina, ou cale-a pelo nome no teste que a tiver por
assunto
```

Cura devolvida: `28 passed`.

**2. A fita — a régua ainda morde o PRODUTO.** Uma cura que só tira marcação
podia ter virado uma régua que sempre passa. Apliquei a mordida que o próprio
arquivo declara — troquei `identidade_do_chip(c, mesa)` por `c["nome"]` em
`monta.fita()` — e ela reprovou nas quatro que dependem do dono do nome:

```
4 failed, 10 passed
FAILED ... test_a_fita_pergunta_ao_dono_do_nome
FAILED ... test_a_fita_nunca_escreve_nao_sei_como_nome_de_controle
FAILED ... test_o_que_ela_nomeou_vence_tudo
FAILED ... test_o_chip_nao_diz_o_transporte_duas_vezes
```

`src/` restaurado no mesmo comando; `git diff --stat -- src/` vazio.

**3. O `piso` do `config` — a máquina medida, não inferida.** Antes de dizer
que a colheita mede a máquina, medi: com `mesa_de_radio.ler_a_mesa` devolvendo
uma `Mesa()` vazia, a colheita cai de **181 para 129**. Cinquenta e dois dos
textos são da máquina desta bancada, não do produto.

**4. O par do `referencias-docs`.** A mordida está no desenho: a régua positiva
e a negativa esperam vereditos opostos sobre o mesmo nome, então uma isenção
derruba uma das duas. Foi o que aconteceu, e é o que continua valendo com o
nome novo — `38 passed`.

## O que NÃO verifiquei

* **A tela.** Nenhuma janela foi aberta e nenhuma foto foi tirada: este
  trabalho não muda uma linha de `src/` nem um byte de `layout/`. As nove
  réguas da aba Jogar passaram a medir o produto em vez da máquina; o que a
  tela dela mostra é o mesmo de antes.
* **O aparelho.** Nenhuma célula do mapa foi exercitada — não houve medição de
  canal, report id ou offset. O que li do mapa foi LEITURA para decidir quem
  vencia (as nove `combinacao.*@sn30` e o `luz.lightbar.brilho@dualsense`), e
  não escrevi uma célula.
* **A suíte inteira.** Rodei os treze arquivos da posse, juntos e isolados, e
  os portões. A suíte é de quem coordena e roda no fim.
* **A máquina dela com a cura `[ OK ]`.** Afirmo pela leitura do dono
  (`check_snd_quirk` devolve `None` no ramo `OK`) e pelo docstring do produto,
  que declara a medição de 06/09. Não consigo forçar o `[ OK ]` aqui sem tocar
  em `/sys`, e não toquei.

## O que sobrou para o próximo

**DEZ vermelhos, com seis donos, e nenhum deles é `src/`.** O diagnóstico de
cada um está na **§5.2 da sprint**, com a medição ao lado. Em uma linha cada:

1. **2 · `test_config_a_palavra_de_tela_da_aba_montada`** →
   `tests/unit/aba_config_sem_a_janela.py`. O `PISO_DA_COLHEITA = 186` é um
   número da MÁQUINA de 08/09. Congele `mesa_de_radio.ler_a_mesa` numa fixture
   declarada e remeça o piso contra o produto — é a mesma cura dos nove.
2. **2 · `test_o_caminho_do_radio_da_luz_no_mapa`** → `docs/data/mapa-controles.csv`:
   `luz.lightbar.brilho@dualsense` está com os DOIS offsets vazios e a régua
   cobra `common[42]` no rádio. **Território de luz — confira com a
   `ILUMINACAO-GRADE-01` antes de escrever.**
3. **1 · `test_bancada_nomeia_coluna_que_o_csv_nao_tem`** → `bancada.py` da
   raiz: o seletor `ESTADOS` não oferece um valor que o mapa já tem, e a grade
   regrava a coluna com o que voltou dela. Mesma família de luz (a queixa cita
   o brilho da BARRA, `backend_pydualsense.py:1364`).
4. **1 · `test_a_prova_da_mesa_de_medicao`** →
   `docs/process/sprints/2026-09-07-O-COMO-DO-MAPA-o-gesto-das-178-celulas.md`:
   quatro células novas (duas de áudio, duas de luz) chegaram sem gesto. **Não
   é mecânico — cada gesto é texto escrito para ela executar.**
5. **1 · `test_leia_primeiro_nao_digita_numero_a_mao`** →
   `docs/data/LEIA-PRIMEIRO.md`. Mecânico:
   `python3 scripts/check_paridade_transporte.py --leia-primeiro --escrever`.
   **Rode DEPOIS do merge desta onda** — os números medem arquivos que as
   outras sprints ainda vão mudar, e regravá-los agora é conflito garantido.
6. **1 · `test_o_painel_encabeca_as_decisoes_dela`** → `html/painel.html`,
   regerado por `scripts/gerar-painel.py`. Mesma ressalva: depois do merge.
7. **2 · `test_o_registro_diz_quem_decidiu`** → `docs/data/decisoes-dela.csv`.
   UMA linha, dois vermelhos: `D-0909-A-COR-DE-OUTRO-CONTROLE-SE-RECUSA-COM-X`
   tem `revoga = COR-TROCA-01`, id que não existe, e a prosa da `escolha` não
   nomeia o revogado.

**E a armadilha que este dia deixa, porque ela voltou pela terceira vez:** *um
número cravado de uma medição é um número da MÁQUINA que a mediu.* Bateu nos
nove da aba Jogar e nos dois do `config` no mesmo dia, por caminhos diferentes
— e nos dois casos o arquivo irmão já sabia e o vizinho não foi junto. **Quando
uma cura calar uma fonte que lê o disco, procure quem mais a lê antes de fechar
a leva.**
