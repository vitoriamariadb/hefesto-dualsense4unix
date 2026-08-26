# LEVA-4-A — o léxico nos quatro cedidos

**26/08/2026.** Frente A da leva 4. Posse: os quatro `app/actions/config/secao_*.py`
cedidos, `tests/unit/test_o_lexico_da_aba_configuracoes.py` e
`scripts/validar-palavra-de-tela.py`.

**O resultado em uma linha:** os parágrafos de apoio da aba caíram de **8 únicos
(10 no total) para 4** — e **quatro das nove tarefas encomendadas estão
BLOQUEADAS por réguas que moram fora desta posse**, com o `arquivo:linha` de cada
bloqueio medido, não presumido.

---

## O que mudou

### LEX-1 — "A mesa" vira "Conexões", "Orçamento" vira "Desempenho"

`secao_mesa.TITULO` e `secao_orcamento.TITULO`. **O renome tinha duas pontas e
hoje tem uma:** `ipc_bridge._CAMPOS_DA_MAQUINA` deixou de guardar cópia e virou
DERIVADO (`ipc_bridge._rotulos_dos_campos`, `:812`, que lê o `TITULO` de cada
seção). Logo o gesto inteiro são duas constantes, e a meia-correção que o
`test_o_titulo_da_secao_e_o_rotulo_do_rodape_sao_a_mesma_palavra` guardava deixou
de ser possível.

A chave do disco NÃO acompanha: `maquina.json` continua com `orcamento`.

### LEX-2 — quatro dos cinco parágrafos saíram da página

A regra: *fica na página o que MUDA, vai para o hover o que EXPLICA.*

| item | frase | onde ela mora agora |
|---|---|---|
| 3/4/5 | `QUANDO_VALE`, a MESMA em três seções | dica da fileira de `_linha_declarada` (`secao_mesa`), da frase de capacidade (`secao_controles`) e dos três perfis (`secao_orcamento`) |
| 1 | `ESCOPO` | anexada à `DICA` do título "Está tudo certo?", **derivada da constante**, nunca copiada |
| 8 | `alcance_de_hoje()` | anexada à `DICA` de "Desempenho" |
| — | `frase_do_preco_por_controle()` (a conta de fatias) | dica do título da conta |

**Duas decisões de implementação que não são detalhe:**

1. **A `QUANDO_VALE` não foi para a dica do TÍTULO da seção**, que é o que a
   LEX-2 pedia. Medido: `test_a_aba_diz_quando_a_escolha_fica_guardada.py::_falas`
   (`:107-152`) monta a seção chamando `secao.montar(hospedeiro_vazio, caixa)` e
   anda **a caixa**, nunca a moldura — a `DICA` do módulo é aplicada por
   `moldura.moldura_de_secao`, FORA de `montar`. A frase na dica do título seria
   invisível para o coletor e derrubaria quatro testes. Ela foi para o widget
   que ela explica, que é a outra metade da mesma regra da LEX-2.
2. **A conta de fatias continua em `BlocoDaConta.falas()`.** A pergunta que
   aquela lista responde nunca foi "está impresso na página?" — é "o que esta
   seção DIZ à pessoa?", e é sobre ela que o portão das `PALAVRAS_DE_CULPA`
   varre tudo. Tirá-la de lá abriria um buraco no portão do tamanho exato da
   frase que saiu da página. O `_desenhar` é que passa a renderizá-la como dica.

E uma cura que só apareceu ao rodar: **a dica tardia nascia sem marca visual.**
`moldura.marcar_afordancias` varre uma vez na montagem e depois se pendura no
"add" de cada caixa — mas por `GLib.idle_add` (`moldura.py:234`), que só corre
com laço principal vivo. O `BlocoDaConta` é redesenhado a cada resposta do
daemon. `test_afordancia_de_dica_na_aba_configuracoes.py::test_nenhum_rotulo_com_dica_fica_invisivel`
reprovou nomeando "Quanto do rádio cada adaptador já gasta"; a cura é uma
chamada explícita a `marcar_afordancias(self.caixa)` no fim do `_desenhar`.

### LEX-9 — as duas perguntas de rádio em português de gente

`D-REDACAO-DAS-DUAS-PERGUNTAS-DE-RADIO` (`docs/data/decisoes-dela.csv:36`,
decidida por delegação em 25/08, marcada para o olho dela).

| hoje | vira |
|---|---|
| `Altura da antena:` · Acima/Abaixo/Não sei | `O dongle fica acima da cabeça de quem joga sentado?` · Sim/Não/Não sei |
| `Linha de visada:` · Livre/Com gente/Não sei | `Tem gente sentada entre o dongle e o sofá?` · Sim/Não/Não sei |

**A segunda trocou de sinal**, e por isso "Sim" grava `com_gente` e "Não" grava
`livre`. Manter a ordem antiga gravaria o oposto do que ela respondeu, e nada na
tela denunciaria. As chaves e os valores do esquema **não mudam** — `MesaDeclarada`
usa `Literal` com `extra="forbid"`, e um valor novo faria o pydantic recusar o
documento INTEIRO dela.

A dica da primeira perdeu a palavra "barramento" no mesmo gesto (uma das cinco
frases da LEX-11).

### LEX-11 — duas das cinco frases de barramento saíram

* a dica do selo `(lido)`: *"O sistema informou o que este aparelho é, pelo
  próprio barramento USB."* → *"O próprio aparelho informou ao sistema o que ele é."*
* a tabela vazia: *"Nenhum outro rádio encontrado no barramento USB."* →
  *"Nenhum outro rádio espetado no computador."*
* a dica das duas perguntas de rádio (junto com a LEX-9)

**As outras duas continuam de pé, e a razão está abaixo.**

### O portão — `test_o_lexico_da_aba_configuracoes.py`

* `AINDA_NA_PAGINA` caiu de **cinco entradas para uma**, e a que ficou traz o
  `arquivo:linha` do que a bloqueia;
* `NUNCA_MENOS_QUE` desceu de **4 para 2**, no mesmo commit. Não para 3: só DOIS
  dos quatro parágrafos restantes são incondicionais — os outros somem sozinhos
  numa bancada com controle na mesa ou com a mesa já desenhada, que é a máquina
  DELA;
* **dente 7** (novo) — as duas seções dizem a palavra dela;
* **dente 8** (novo) — as duas perguntas não falam "antena" nem "visada", e cada
  botão grava o mesmo valor de esquema de antes.

---

## Qual mordida prova

Cinco mordidas, todas **rodadas**, cura arrancada e devolvida.

### 1 — dente 1: a `QUANDO_VALE` devolvida à página de "Desempenho"

```
$ sed: caixa.pack_start(rotulo_de_apoio(QUANDO_VALE), False, False, 0)  -> secao_orcamento.montar
E       AssertionError: parágrafo de apoio na PÁGINA que não está declarado:
E           A escolha passa a valer quando você clicar em "Aplicar", no rodapé.
FAILED tests/unit/test_o_lexico_da_aba_configuracoes.py::test_nenhum_paragrafo_de_apoio_novo_na_pagina
1 failed in 0.50s
########## CURA DEVOLVIDA ##########
1 passed in 0.48s
```

### 2 — dente 7: `TITULO` volta a "A mesa"

```
E       AssertionError: estas seções voltaram ao nome velho: secao_mesa diz 'A mesa' e devia dizer 'Conexões'
E       assert not {'secao_mesa': 'A mesa'}
FAILED tests/unit/test_o_lexico_da_aba_configuracoes.py::test_as_duas_secoes_renomeadas_dizem_a_palavra_dela
1 failed in 0.44s
```

### 3 — dente 8: o rótulo volta a "Altura da antena:"

```
E       AssertionError: as duas perguntas de rádio voltaram ao jargão que ela disse não entender: Altura da antena:
E       assert not ['Altura da antena:']
FAILED tests/unit/test_o_lexico_da_aba_configuracoes.py::test_as_duas_perguntas_de_radio_nao_falam_antena_nem_visada
1 failed in 0.44s
```

### 4 — dente 8, a segunda metade: `("acima", "Sim")` vira `("sim", "Sim")`

É a que impede a reescrita de redação de virar quebra de esquema.

```
E       AssertionError: o botão "Sim" da pergunta 'altura_da_antena' grava 'sim' e tem de gravar 'acima'
E         - acima
E         + sim
FAILED tests/unit/test_o_lexico_da_aba_configuracoes.py::test_a_redacao_nova_grava_os_mesmos_valores_de_esquema
1 failed in 0.45s
```

### 5 — o piso novo: coletor quebrado (`dim-label` -> `nao-existe`)

Sem esta metade, o dente 1 ficaria verde e MUDO.

```
E       AssertionError: a régua achou 0 parágrafo(s) de apoio na aba, e o piso é 2.
E       assert 0 >= 2
FAILED tests/unit/test_o_lexico_da_aba_configuracoes.py::test_a_regua_continua_achando_o_que_promete_achar
1 failed, 18 passed in 0.69s
```

### O estado verde, e a medição do resultado

```
$ pytest -q tests/unit/test_o_lexico_da_aba_configuracoes.py
19 passed in 0.67s

$ _paragrafos_de_apoio(_aba_montada())
ANTES (25/08):  8 únicos, 10 no total
DEPOIS (26/08): TOTAL: 4 UNICOS: 4
 - Com o microfone ligado, um controle no rádio troca 260,4 relatórios ...   (bloqueada, ver abaixo)
 - Nenhum controle na mesa agora. Conecte um pelo cabo ou pelo rádio ...      (ESTADO, fica)
 - Não sei quem está no rádio — o Hefesto não respondeu. ...                  (ESTADO, fica)
 - Você ainda não desenhou a sua mesa. ...                                    (ESTADO, fica)
```

### Os portões

```
$ bash scripts/portoes.sh --rapido
TODOS VERDES — 19 portões.

$ ruff check src/ tests/
All checks passed!

$ pytest -q tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
39 passed
```

---

## O que NÃO verifiquei

1. **A TELA.** Não rodei `retratar_abas.py` (R-C) e **não olhei um único pixel**.
   Toda a medição desta frente é da árvore de widgets, nunca da foto. As dez
   frases que mudaram de lugar ou de palavra **não passaram pelo olho dela** —
   estão marcadas `PROVISÓRIO — decisão dela` no código.
   `test_as_fotos_acompanham_a_versao.py` está **VERMELHO** nesta árvore, e é o
   esperado: quem coordena fotografa uma vez, no fim, já em `onda/atual`.
2. **Se a dica cabe na tela.** A `DICA` de "Desempenho" ganhou a
   `alcance_de_hoje()` e a de "Está tudo certo?" ganhou a `ESCOPO`; a dica de
   cada perfil ganhou a `QUANDO_VALE`. Não medi a largura de nenhum tooltip
   resultante — um tooltip longo demais é defeito de tela, e só a foto diz.
3. **Se "Sim/Não" é a palavra certa para as duas perguntas.** A redação é
   decidida por DELEGAÇÃO, não por ela. A inversão de sinal da segunda pergunta
   está provada no código e no teste; que ela LEIA bem, não.
4. **A LEX-6 e a LEX-7 não foram tentadas** — só medidas (abaixo). Não sei se o
   `CampoDeBusca` cabe na coluna "O que é" sem crescer a tabela, nem se o
   `MedidorDeRadio` se comporta dentro de um `Gtk.Grid`.
5. **Não rodei a suíte inteira** (é de quem coordena, e no fim).

---

## O que sobrou para o próximo

### A — O QUE ESTA FRENTE QUEBROU, e o conserto é de duas linhas

`tests/unit/test_descartados_chegam_ao_rodape.py` tem **4 testes vermelhos**
depois da LEX-1. A causa é a que a própria derivação existe para matar: o
arquivo **digita o rótulo à mão**, num comentário que diz que ele é o `TITULO` da
seção.

```
FAILED test_a_lista_atravessa_o_fio
FAILED test_a_ponte_nunca_entrega_identificador_de_protocolo
FAILED test_corpo_torto_do_daemon_nao_derruba_o_aplicar
FAILED test_a_frase_do_descarte_chega_ao_rotulo_do_rodape
```

**O conserto, para colar:**

```python
# tests/unit/test_descartados_chegam_ao_rodape.py:70-71
from hefesto_dualsense4unix.app.actions.config import secao_mesa, secao_orcamento

#: O rótulo de tela do campo descartado — LIDO do `TITULO` da seção, nunca
#: digitado: foi a cópia que ficou vermelha quando a LEX-1 renomeou as duas.
ROTULO_DO_ORCAMENTO = secao_orcamento.TITULO
ROTULO_DA_MESA = secao_mesa.TITULO

# :233
assert descartados == (ROTULO_DA_MESA, ROTULO_DO_ORCAMENTO)
```

Não o apliquei porque o arquivo não está na posse da LEVA-4-A (R-A).

### B — As quatro tarefas BLOQUEADAS, com o bloqueio medido

Nenhuma delas cabe dentro desta posse. Cada uma é **uma régua alheia que prende
a palavra velha letra por letra** — e é por isso que a régua tem de mudar junto,
no mesmo commit, por quem tiver os dois arquivos.

| tarefa | o que trava | onde |
|---|---|---|
| **LEX-11** (as 2 frases que sobraram) | `assert _onde_esta_o_adaptador(_NO_HUB) == ("Barramento 3, porta 1.2 · Direita", None)` e `assert dica == "Lido do barramento USB: ..."` | `test_a_porta_dela_chega_na_frase.py:141-151` (`test_sem_mapa_a_frase_e_a_de_hoje`) |
| **LEX-8** (`_PAINEL_DESCONHECIDO` -> "O Hefesto não sabe") | `assert _painel_em_portugues("unknown") == "Não sei"`, `assert "Não sei" in texto`, e `secao_mesa._PAINEL_DESCONHECIDO in tela` | `test_a_mesa_le_o_barramento.py:376, 407-408`; `test_b1_o_medidor_sem_daemon_nao_diz_folgada.py:123` |
| **LEX-6** (`vizinho do adaptador N` -> nome/entrada; colunas novas) | `assert _onde_esta_o_radio(vizinho, avisos[...]) == "Não sei · vizinho do adaptador 2"` | `test_a_mesa_le_o_barramento.py:620-621` |
| **LEX-7** (medidores viram colunas de Conexões) | `painel._caixa_medidores` e `painel._fileira_do_medidor(...)` como widgets soltos | `test_b1_o_medidor_sem_daemon_nao_diz_folgada.py:68, 154`; `test_o_nome_do_dongle_chega_na_aba.py:444-483` |
| **LEX-2, item 2** (a frase do microfone) | `assert _rotulos(caixa).count(frase) == 1`, e o `_rotulos` daquele arquivo colhe SÓ `get_label()`, nunca dica | `test_o_interruptor_do_microfone_na_aba_configuracoes.py:445-452` e `:139-151` |

**O padrão, e ele tem nome nesta casa:** é a mesma migração `_textos` -> `_falas`
que a G9 já fez em 25/08 em `test_a_aba_diz_quando_a_escolha_fica_guardada.py`.
A pergunta que essas réguas fazem é *"está impresso na página?"*, e a decisão
dela (*"tudo isso em azul deveria ser tooltip"*) move a resposta de um lugar
para o outro **sem mudar a pergunta**. Régua que prende o texto impresso reprova
a própria cura que deveria aprovar.

### C — A LINHA QUE AINDA ESPERA, e ela NÃO foi colada

`scripts/validar-palavra-de-tela.py:208` continua com

```python
_A_PALAVRA_QUE_ESPERA_A_LEX_6 = "barramento"
```

**e a entrada `"barramento": "diga a entrada USB: 'Entrada 4 do hub'"` NÃO entrou
em `JARGAO_BANIDO`** — colada hoje, ela reprova, porque duas das cinco frases
continuam na tela (`secao_mesa._onde_esta_o_adaptador`, a coluna "Onde está" e a
dica do hub). O comentário daquele bloco foi deixado intacto de propósito: ele já
diz exatamente isto, e reescrevê-lo para dizer "faltam duas em vez de cinco"
seria trocar um texto certo por outro certo. **O `secao_mesa.py` ganhou o
marcador no ponto exato**, com o `arquivo:linha` do que trava.

Quem fechar a LEX-11 cola a linha **no mesmo commit** que trocar a última das
duas.

### D — Duas dívidas menores que nasceram aqui

1. **A `QUANDO_VALE` de `secao_controles` mora na frase de capacidade do
   microfone.** Quando a frente C mover a caixinha do microfone para Desempenho,
   ela leva a dica junto — e a seção fica sem nenhum widget permanente para
   hospedá-la. Está escrito na entrada de `AINDA_NA_PAGINA`.
2. **`NUNCA_MENOS_QUE` desce para 1** no commit que mover a frase do microfone.

