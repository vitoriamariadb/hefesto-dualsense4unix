---
sprint: OS-VINTE-E-SEIS-VERMELHOS-01
estado: aberta
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
    - `tests/unit/test_sn30_plataforma_e_identidade_transporte.py::TestAsDezCelulasContinuamEscritas::test_as_nove_linhas_de_combinacao_continuam_mudas_de_proposito`
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
