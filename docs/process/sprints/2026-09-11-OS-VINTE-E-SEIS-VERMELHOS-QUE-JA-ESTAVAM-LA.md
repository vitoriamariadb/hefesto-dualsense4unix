---
sprint: OS-VINTE-E-SEIS-VERMELHOS-01
estado: feita
onda: A-LISTA-DE-0911
posse:
  OS-VINTE-E-SEIS-VERMELHOS-01:
    - docs/process/sprints/2026-09-11-OS-VINTE-E-SEIS-VERMELHOS-QUE-JA-ESTAVAM-LA.md
    # OS DOZE ARQUIVOS DOS VINTE E CINCO, acrescentados em 11/09 quando ela
    # mandou um agente cuidar disto em paralelo. Sem eles na posse, quem
    # executar esta sprint escreve fora da posse e a costura conflita.
    - tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py
    - tests/unit/test_a_fita_diz_o_controle_que_esta_na_mesa.py
    - tests/unit/test_a_prova_da_mesa_de_medicao.py
    - tests/unit/test_bancada_nomeia_coluna_que_o_csv_nao_tem.py
    - tests/unit/test_causa_nao_declarada_z6_05.py
    - tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py
    - tests/unit/test_identidade_do_aplicativo_01.py
    - tests/unit/test_leia_primeiro_nao_digita_numero_a_mao.py
    - tests/unit/test_o_caminho_do_radio_da_luz_no_mapa.py
    - tests/unit/test_o_painel_encabeca_as_decisoes_dela.py
    - tests/unit/test_o_registro_diz_quem_decidiu.py
    - tests/unit/test_sn30_plataforma_e_identidade_transporte.py
    - tests/unit/test_validar_referencias_docs.py
cria: []
bancada: false
depois_de: []
nao_toca:
  # A CURA É DO TESTE, NÃO DO PRODUTO. Um vermelho que só fecha mexendo em
  # `src/` não é desta sprint: ele é defeito de produto e vira frente própria,
  # com a medição no relatório.
  - src/
  - tests/unit/test_o_cadeado_mora_no_canto_do_bloco.py
---

# OS VINTE E SEIS VERMELHOS QUE JÁ ESTAVAM LÁ — medidos na costura de 11/09

> **ESTADO 2026-09-11: feita** — QUINZE dos vinte e cinco fecharam, e os
> nove do `test_a_aba01_…` tinham UMA causa só, como a §3 apostava. Os DEZ
> que sobram estão diagnosticados um a um na §5, com o arquivo dono de
> cada um — nenhum deles fecha dentro da posse desta sprint.

**Esta sprint não conserta nada. Ela REGISTRA um número que ninguém tinha**, e
que só apareceu porque a leva de 11/09 rodou a suíte inteira antes do merge.

---

## §0 — O NÚMERO, e a conta que o separa

A suíte inteira na árvore costurada (`onda/0911`, 24 partes, 1257 arquivos):
**27 vermelhos**.

| quantos | o quê |
| --- | --- |
| **25** | já reprovam no `dev` de hoje (`5fdbf090`, que é o `origin/dev`) — **anteriores à leva** |
| **1** | `test_a_aba_lancadores_diz_a_verdade::test_todo_endereco_da_pagina_tem_quem_o_pinte` — contaminação por ordem, também anterior |
| **1** | a régua nova do som — **curada na costura**, commit `3fbdff2f` |
| **0** | regressão desta leva |

**A COMPARAÇÃO FOI FEITA IGUAL COM IGUAL, e isso importa:** o mesmo lote de 14
arquivos rodado nas duas árvores dá **exatamente os mesmos 25 vermelhos**, sem
um a mais nem um a menos. Lote não é a suíte — a contaminação por ordem muda com
a companhia —, então medir a base com um conjunto e a costura com outro teria
produzido um número falso nos dois sentidos.

**E A PRIMEIRA TENTATIVA DE MEDIR CAIU NA ARMADILHA QUE O `CLAUDE.md` NOMEIA:**
rodar os 15 arquivos na base devolveu `no tests ran in 0.18s`, rc=4 — porque UM
deles nasceu nesta leva e não existe lá, e **um arquivo que não existe aborta o
lote inteiro em silêncio**. `no tests ran` lê-se como limpo. A cura foi filtrar
pelos que existem na base, e é por isso que o número é 14 e não 15.

## §1 — OS VINTE E CINCO, um a um

Todos reprovam em `5fdbf090` e em `onda/0911`, do mesmo jeito:

    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_a_coluna_nao_estoura_o_que_a_pagina_publica`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_a_conta_e_a_do_produto_e_conta_o_que_a_coluna_mostra`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_a_linha_sem_aviso_nao_fica_com_travessao`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_a_recusa_de_outro_jogo_nao_cala_este`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_as_duas_recusas_dela_calam_a_coluna_atencao[dispensa]`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_as_duas_recusas_dela_calam_a_coluna_atencao[tirar-daqui]`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_o_aviso_do_jogo_sem_atalho_acende_na_coluna`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_sem_appid_o_aviso_continua`
    - `tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py::test_uma_boa_noticia_nao_entra_na_coluna_atencao`
    - `tests/unit/test_a_fita_diz_o_controle_que_esta_na_mesa.py::test_a_fita_pergunta_ao_dono_do_nome`
    - `tests/unit/test_a_fita_diz_o_controle_que_esta_na_mesa.py::test_o_chip_nao_diz_o_transporte_duas_vezes`
    - `tests/unit/test_a_prova_da_mesa_de_medicao.py::test_o_acervo_do_mapa_tambem_tem_gesto`
    - `tests/unit/test_bancada_nomeia_coluna_que_o_csv_nao_tem.py::test_todo_selectbox_da_grade_oferece_os_valores_que_o_mapa_ja_tem`
    - `tests/unit/test_causa_nao_declarada_z6_05.py::test_causa_vazia_com_de_onde_sei_inferido_nao_reprova`
    - `tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py::test_a_folga_do_piso_tem_tamanho_medido`
    - `tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py::test_o_berco_nao_e_mais_frouxo_que_o_glade`
    - `tests/unit/test_identidade_do_aplicativo_01.py::test_o_id_antigo_so_sobrevive_nos_pontos_de_transicao_declarados`
    - `tests/unit/test_leia_primeiro_nao_digita_numero_a_mao.py::test_o_documento_confere_com_a_medicao_de_agora`
    - `tests/unit/test_o_caminho_do_radio_da_luz_no_mapa.py::test_o_brilho_e_o_fade_dizem_o_byte_e_o_bit_que_o_valida[luz.lightbar.brilho@dualsense-42-1]`
    - `tests/unit/test_o_caminho_do_radio_da_luz_no_mapa.py::test_toda_linha_de_luz_com_rota_no_radio_diz_o_byte[luz.lightbar.brilho@dualsense]`
    - `tests/unit/test_o_painel_encabeca_as_decisoes_dela.py::test_toda_decisao_do_csv_chega_a_pagina`
    - `tests/unit/test_o_registro_diz_quem_decidiu.py::test_o_revoga_aponta_decisao_que_existe`
    - `tests/unit/test_o_registro_diz_quem_decidiu.py::test_quem_revoga_nomeia_o_revogado_na_prosa`
    - `tests/unit/test_sn30_plataforma_e_identidade_transporte.py::TestAsDezCelulasContinuamEscritas::test_as_nove_linhas_de_combinacao_continuam_mudas_de_proposito` (hoje `…::test_as_nove_linhas_de_combinacao_nunca_afirmam_medido_sem_bancada`
    - `tests/unit/test_validar_referencias_docs.py::test_link_que_sobe_nao_ganha_a_leniencia_de_sufixo`

**O que se lê deles, de fora:** nove são de UM arquivo (`test_a_aba01_…`), o que
sugere uma causa só; os outros dezesseis espalham-se por doze arquivos e três
famílias — documento que confere com medição (`leia_primeiro`, `o_painel`,
`o_registro`), mapa de canais (`o_caminho_do_radio_da_luz`, `sn30`, `causa_nao
_declarada`, `bancada_nomeia_coluna`) e tela (`a_fita`, `config_a_palavra`).
**Nada disso foi diagnosticado**: este documento diz que eles existem, não por
quê.

## §2 — POR QUE ISTO É UMA SPRINT E NÃO UMA CURA

**Porque nenhum deles é desta leva, e curar o que não se mediu é o que produz a
próxima regressão.** A regra da casa é que a suíte é de quem coordena e roda no
FIM; ela rodou, e o que ela achou é isto. Misturar 25 curas alheias num merge de
oito sprints tiraria de quem vier a chance de saber o que veio de onde.

**E porque o portão não os pega.** `bash scripts/portoes.sh` fecha **TODOS
VERDES — 56 portões** nas duas árvores: a suíte inteira não é portão, é o passo
seguinte. Um número que o portão não vê e que ninguém escreve é um número que
some.

## §3 — O QUE A PRÓXIMA PESSOA FAZ, e a ordem é barata

1. **Comece pelos nove do `test_a_aba01_le_o_estado_em_vez_de_cravar.py`** — é
   um arquivo só, e nove de vinte e cinco. Se for causa única, o número cai para
   dezesseis num commit.
2. **Rode cada um SOZINHO antes de acreditar no vermelho.** Um deles já se sabe
   ser de ordem (`test_todo_endereco_da_pagina_tem_quem_o_pinte`, aba 07:
   79 passed sozinho, reprova em lote — e reprova IGUAL com o `src/` da base por
   cima, medido na conferência de 11/09).
3. **A contaminação da aba 07 tem endereço**: o pacote dela emite
   `org-azahar_emu-azahar-*` e envenena o arquivo vizinho por ordem de teste. É
   a mesma família que esta casa já pagou duas vezes, e a cura que ela pede é a
   de sempre: *estado de módulo tem um dono, e quem mede o módulo o zera.*
   O precedente está no commit `3fbdff2f` desta leva.

## §4 — O QUE É DELA

Nada. Isto é dívida técnica interna e **não chega à tela** — ordem dela de
07/09: *"o layout não informa os nossos defeitos"*. Ela decide só a PRIORIDADE:
vinte e cinco testes vermelhos que não quebram o produto competem com a fila de
features, e essa conta é dela.

---

## §5 — OS VINTE E CINCO, DIAGNOSTICADOS — 11/09/2026

A §1 dizia *"nada disso foi diagnosticado"*. Agora está, um a um, e **cada um
foi rodado SOZINHO antes de acreditar no vermelho**: os vinte e cinco reprovam
isolados. Nenhum é contaminação por ordem — a única de ordem conhecida é a da
aba 07, que a §3.2 já nomeia e que não está nesta lista.

### §5.1 — OS QUINZE QUE FECHARAM, e a §3 acertou a aposta

| quantos | arquivo | a causa, medida |
| --- | --- | --- |
| **9** | `test_a_aba01_…` | UMA fonte de aviso que pergunta à MÁQUINA |
| 2 | `test_a_fita_…` | a régua lia a marcação de ontem |
| 1 | `test_sn30_…` | o MAPA respondeu, e o mapa vence |
| 1 | `test_identidade_do_aplicativo_01` | dois pontos declarados que a árvore apagou |
| 1 | `test_validar_referencias_docs` | o nome da fixture virou isenção |
| 1 | `test_causa_nao_declarada_z6_05` | o portão ficou mais duro em 06/09 |

**OS NOVE ERAM UMA CAUSA SÓ, e ela tem nome:** em 06/09 a cura do travamento do
USB entrou como mais uma fonte de `a01_jogar._avisos`, e ela lê o disco
(`/sys/module/snd_usb_audio/parameters/quirk_flags` e
`/etc/modprobe.d/hefesto-dualsense-storm.conf`) em vez do `state` que os testes
montam. **O que faz a régua virar é o que está NO CABO, não a máquina** — há
uma máquina só (`MeowSystem`), e `/sys/module` e `/etc/modprobe.d` são dela,
não da árvore. O `snd_usb_audio` só carrega quando há aparelho de áudio USB
plugado: **sem ele o `quirk_flags` nem existe, sobra o drop-in, e
`check_snd_quirk` responde `[INFO]`** (*a cura está agendada, esperando o
replug*) — uma linha de selo `CONTROLE` entra na coluna e as nove reprovam com
nove diffs diferentes. **Com o módulo carregado trazendo o quirk ele responde
`[ OK ]` e as nove passam.** Os dois lados, sem plugar nada — a função é pura
quando se dá o texto:

```bash
python -c "from hefesto_dualsense4unix.integrations.storm_doctor import \
  check_snd_quirk as c; print(c()); \
  print(c('054c:0ce6:ignore_ctl_error|ctl_msg_delay_1m'))"
# ('[INFO]', 'a cura do travamento está agendada. …')   ← medido em 11/09
# ('[ OK ]', 'cura do travamento do USB ATIVA …')       ← o quirk no ar
```

**O `[ OK ]` NÃO FOI OBSERVADO com controle no cabo** — só com o texto dado à
mão acima. *Não medido* é o que se sabe dele.

O arquivo IRMÃO já calava essa fonte desde que ela nasceu, com a razão escrita
no `_so_estes` dele (`test_a01_a_coluna_atencao_acende_o_mais_grave.py`). Este
não foi junto. **A cura fecha a família inteira, e não só a fonte que gritou:**
`_do_exame` — que pergunta ao `a08_conexoes._exame()`, isto é, aos controles que
estão na mesa AGORA — saiu no mesmo gesto, porque com a mesa vazia ele cala e
com os quatro DualSense na mesa derrubaria as mesmas quatro réguas por outro
nome. **É a mesma virada da cura do travamento: o que muda é o que está plugado
no minuto, não a máquina.**

**E FICOU UMA RÉGUA NOVA, que é o que faltava em 06/09:**
`test_nenhuma_fonte_fala_sem_este_arquivo_saber` reprova UMA vez, dizendo o
campo `fonte` de quem falou — o endereço exato da função a acrescentar. Nove
diffs de lista contra uma frase que manda no lugar certo. O limite dela está
declarado no docstring: ela pega a fonte nova que FALA na máquina em que a
suíte roda.

### §5.2 — OS DEZ QUE SOBRAM, e nenhum fecha dentro desta posse

Cada linha diz o **arquivo dono** — e nenhum deles está na `posse:` do
frontmatter. A regra de §2 vale ao contrário também: curar fora da posse é como
a costura vira "a última a gravar vence".

| vermelhos | dono do conserto | a causa, medida em 11/09 |
| --- | --- | --- |
| 2 · `test_config_a_palavra_de_tela_da_aba_montada` | `tests/unit/aba_config_sem_a_janela.py` | **o piso mede a MÁQUINA.** A seção "Conexões" enumera o que o sysfs responde (`mesa_de_radio.ler_a_mesa`): 2 adaptadores e 3 rádios vizinhos aqui. Medido: com a mesa de rádio VAZIA a colheita cai de 181 para **129** — 52 dos textos são da máquina. O `PISO_DA_COLHEITA = 186` foi medido em 08/09 (`f270cfd7`) noutra vizinhança; hoje a colheita dá 179 sob a suíte. As seções em si não mudaram (o diff de `config/` desde `f270cfd7` são duas linhas de comentário). **A cura é a do §5.1**: congelar a leitura da máquina no berço e remedir o piso contra o PRODUTO. |
| 2 · `test_o_caminho_do_radio_da_luz_no_mapa` | `docs/data/mapa-controles.csv` | `luz.lightbar.brilho@dualsense` está com `cabo_offset` E `radio_offset` VAZIOS, e a régua cobra `common[42]` no lado do rádio. É território de luz — provável posse da `ILUMINACAO-GRADE-01`. |
| 1 · `test_bancada_nomeia_coluna_que_o_csv_nao_tem` | `bancada.py` (raiz) | o seletor `ESTADOS` da grade não oferece um valor que o mapa já tem, e a gravação regrava a coluna com o que voltou da grade — o que não está em `options` não volta. Mesmo território de luz: a queixa cita o brilho da BARRA (`backend_pydualsense.py:1364`). |
| 1 · `test_a_prova_da_mesa_de_medicao` | `docs/process/sprints/2026-09-07-O-COMO-DO-MAPA-o-gesto-das-178-celulas.md` | quatro células do mapa chegaram sem gesto: `mapa-audio.alto_falante-radio`, `mapa-audio.saida_dedicada.payload_do_degrau-radio`, `mapa-luz.led_jogador.brilho-cabo` e `-radio`. São as células que o som pelo rádio e a luz acrescentaram, e o arquivo do gesto não foi junto. **Não é mecânico: cada gesto é texto escrito para ela executar.** |
| 1 · `test_leia_primeiro_nao_digita_numero_a_mao` | `docs/data/LEIA-PRIMEIRO.md` | doze números do censo envelheceram (o mapa em 311 linhas contra 308 publicadas, o caderno em 227 contra 184). **É mecânico e tem comando:** `python3 scripts/check_paridade_transporte.py --leia-primeiro --escrever`. Fica de fora daqui de propósito: os números medem arquivos que outras sprints desta mesma onda ainda vão mudar, e regravá-los agora é conflito garantido na costura. **Regrave DEPOIS do merge.** |
| 1 · `test_o_painel_encabeca_as_decisoes_dela` | `html/painel.html` | `D-0809-A-EPIC-FICA-DENTRO-DO-HEROIC` está no CSV e não está na página gerada. Regeneração por `scripts/gerar-painel.py` — e vale a mesma ressalva do `LEIA-PRIMEIRO`: depois do merge. |
| 2 · `test_o_registro_diz_quem_decidiu` | `docs/data/decisoes-dela.csv` | UMA linha, dois vermelhos: `D-0909-A-COR-DE-OUTRO-CONTROLE-SE-RECUSA-COM-X` tem `revoga = COR-TROCA-01`, um id que não existe no CSV, e a prosa da `escolha` não nomeia o revogado. |

**A CONTA QUE ISSO DEIXA:** o piso da suíte cai de 25 para 10, e os dez têm
SEIS donos, nenhum deles `src/`. Quatro dos dez (`config`, `luz`, `bancada`, o
gesto) são trabalho de verdade; dois (`LEIA-PRIMEIRO`, `painel`) são
regeneração que só deve rodar depois do merge desta onda.
